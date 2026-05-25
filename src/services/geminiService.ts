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

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function callProxyAPI(imageData: string): Promise<AnalysisResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData }),
    });

    const responseText = await response.text();
    let responseData: any;

    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (jsonError) {
      console.error('Failed to parse proxy response body:', responseText);
      throw new Error('Proxy API returned invalid JSON. Please try again.');
    }

    if (!response.ok) {
      const errorMessage = responseData?.error || response.statusText;
      throw new Error(`${errorMessage}`);
    }

    return responseData as AnalysisResult;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Proxy error: ${error.message}`);
    }
    throw error;
  }
}

async function callGeminiDirectly(imageData: string, apiKey: string): Promise<AnalysisResult> {
  const mimeTypeMatch = imageData.match(/^data:([^;]+);base64,/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
  const base64Image = imageData.split(',')[1] || imageData;

  if (!base64Image || base64Image.length < 100) {
    throw new Error('Image data is invalid or too small. Please provide a clearer image.');
  }

  console.log(`[Dev Direct] Image size: ${(base64Image.length / 1024).toFixed(2)} KB`);
  console.log(`[Dev Direct] MimeType detected: ${mimeType}`);

  const prompt = `Analyze this book page image and extract vocabulary information.

CRITICAL: You MUST respond with ONLY valid JSON matching the schema.

Instructions:
1. Read ALL text from the image carefully.
2. Extract 5-10 of the most difficult English words.
3. For each word: provide a definition, its category if applicable (otherwise null), and how it is used in the text (the exact sentence/phrase).
4. extractedText: Copy the ENTIRE text from the image.
5. words: Array with at least 5 words, maximum 10.`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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
    throw new Error('Gemini API returned invalid JSON. Please try again.');
  }

  if (!response.ok) {
    const errorMessage = responseData?.error?.message || response.statusText;
    throw new Error(`Gemini API error: ${response.status} - ${errorMessage}`);
  }

  console.log('Gemini API Response received successfully');

  const contentText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!contentText) {
    console.error('Missing content in response:', responseData);
    throw new Error('Gemini API did not return text content.');
  }

  let result: any = null;
  try {
    result = JSON.parse(contentText);
  } catch (parseError) {
    console.error('Failed to parse JSON content from Gemini:', contentText);
    throw new Error('Failed to parse Gemini model response. Please try again.');
  }

  if (!result || typeof result !== 'object') {
    throw new Error('Gemini returned unexpected result format.');
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
    throw new Error('Model could not extract any words. Please try with a clearer image of text.');
  }

  return result as AnalysisResult;
}

export async function analyzeBookPage(imageData: string): Promise<AnalysisResult> {
  const isDev = import.meta.env.DEV;

  // Local development fallback: if VITE_GEMINI_API_KEY is present and we're in dev mode, run client-side.
  if (isDev && GEMINI_API_KEY) {
    console.log('Running Gemini analysis locally (direct client-side)...');
    try {
      return await callGeminiDirectly(imageData, GEMINI_API_KEY);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  }

  // Production or proxy mode: make a call to our Vercel Serverless Function
  console.log('Running Gemini analysis securely via Vercel Serverless proxy...');
  try {
    return await callProxyAPI(imageData);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
    throw error;
  }
}
