import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface DifficultWord {
  word: string;
  category: string | null;
  definition: string;
  contextual: string;
}

export interface AnalysisResult {
  words: DifficultWord[];
  extractedText: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { imageData } = req.body;
  if (!imageData) {
    return res.status(400).json({ error: 'Missing imageData in request body' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('Server Configuration Error: GEMINI_API_KEY is not defined in the environment variables.');
    return res.status(500).json({ 
      error: 'Gemini API key is not configured on the server. Please check your Vercel Environment Variables.' 
    });
  }

  try {
    const mimeTypeMatch = imageData.match(/^data:([^;]+);base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
    const base64Image = imageData.split(',')[1] || imageData;

    if (!base64Image || base64Image.length < 100) {
      return res.status(400).json({ error: 'Image data is invalid or too small.' });
    }

    console.log(`Analyzing image of size: ${(base64Image.length / 1024).toFixed(2)} KB, MIME type: ${mimeType}`);

    const prompt = `Analyze this book page image and extract vocabulary information.

CRITICAL: You MUST respond with ONLY valid JSON matching the schema.

Instructions:
1. Read ALL text from the image carefully.
2. Extract 5-10 of the most difficult English words.
3. For each word: provide a definition, its category if applicable (otherwise null), and how it is used in the text (the exact sentence/phrase).
4. extractedText: Copy the ENTIRE text from the image.
5. words: Array with at least 5 words, maximum 10.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              extractedText: {
                type: 'STRING',
                description: 'Complete text you read from the image (required - must be the full page text)',
              },
              words: {
                type: 'ARRAY',
                description: 'Array of 5 to 10 difficult words from the text',
                items: {
                  type: 'OBJECT',
                  properties: {
                    word: {
                      type: 'STRING',
                      description: 'difficult word from the text',
                    },
                    category: {
                      type: 'STRING',
                      nullable: true,
                      description: 'MEDICAL/TECHNICAL/null or similar uppercase tag',
                    },
                    definition: {
                      type: 'STRING',
                      description: 'Simple clear definition',
                    },
                    contextual: {
                      type: 'STRING',
                      description: 'Exact sentence or phrase where word appears',
                    },
                  },
                  required: ['word', 'definition', 'contextual'],
                },
              },
            },
            required: ['extractedText', 'words'],
          },
        },
      }),
    });

    const responseText = await response.text();
    let responseData: any;

    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (jsonError) {
      console.error('Failed to parse Gemini response body:', responseText);
      return res.status(502).json({ error: 'Gemini API returned invalid JSON. Please try again.' });
    }

    if (!response.ok) {
      const errorMessage = responseData?.error?.message || response.statusText;
      console.error(`Gemini API error: ${response.status} - ${errorMessage}`);
      return res.status(response.status).json({ 
        error: `Gemini API error: ${response.status} - ${errorMessage}` 
      });
    }

    console.log('Gemini API Response received successfully');

    const contentText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!contentText) {
      console.error('Missing content in response:', responseData);
      return res.status(502).json({ error: 'Gemini API did not return text content.' });
    }

    let result: any = null;
    try {
      result = JSON.parse(contentText);
    } catch (parseError) {
      console.error('Failed to parse JSON content from Gemini:', contentText);
      return res.status(502).json({ error: 'Failed to parse Gemini model response.' });
    }

    if (!result || typeof result !== 'object') {
      return res.status(502).json({ error: 'Gemini returned unexpected result format.' });
    }

    if (!result.extractedText || typeof result.extractedText !== 'string' || result.extractedText.trim().length === 0) {
      result.extractedText = result.extractedText || 'Text extraction in progress...';
    }

    if (!Array.isArray(result.words)) {
      result.words = [];
    }

    result.words = result.words.filter((w: any) => w && typeof w.word === 'string' && w.word.trim().length > 0);
    result.words = result.words.map((w: any) => ({
      word: w.word || 'unknown',
      category: w.category || null,
      definition: w.definition || 'Definition not available',
      contextual: w.contextual || 'Context not available',
    }));

    if (result.words.length === 0) {
      return res.status(422).json({ 
        error: 'Model could not extract any words. Please try with a clearer image of text.' 
      });
    }

    // Set Cache-Control headers if appropriate (usually API responses should not be cached)
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json(result as AnalysisResult);

  } catch (error) {
    console.error('Request handler error:', error);
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return res.status(500).json({ error: `Internal Server Error: ${message}` });
  }
}
