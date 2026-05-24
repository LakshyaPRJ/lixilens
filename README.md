# LixiLens

Status: MVP (Minimum Viable Product) — early-stage prototype focused on core capture and analysis flow.

LixiLens is a small, privacy-friendly web app that extracts and highlights difficult vocabulary from photographed book pages. It provides a fast camera/upload workflow to capture a page, sends the image to a hosted language model (via Google Gemini API), and returns the page text plus a curated list of challenging words with definitions and contextual examples.

**Built with:** Vite + React + TypeScript, Tailwind CSS, and integrates with Google Gemini API for model-based analysis.

## Features

- Capture a photo using the device camera or upload an image file.
- Confirm captured image before analysis.
- Send image to a language model to extract full page text and 5–10 difficult words with definitions and context.
- View analysis results as a vocabulary list and the extracted page text.
- Small, focused UI components for scan history, curated lexicons, and a daily scholar section.

## Quick start

Prerequisites: Node 18+ and npm or pnpm installed.

Install and run locally:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Project scripts are defined in [package.json](package.json).

## Configuration / Environment

The app uses environment variables for the Gemini API integration. Create a `.env.local` (or similar) file in the project root and set the following values:

- `VITE_GEMINI_API_KEY` — your Google Gemini API key (required to analyze images)

See the implementation in [src/services/geminiService.ts](src/services/geminiService.ts).

Important: Do not commit your API keys to version control.

## Project structure (high level)

- [src/App.tsx](src/App.tsx) — main application flow and screen routing (home → confirm → analyzing → results)
- [src/services/geminiService.ts](src/services/geminiService.ts) — image analysis and model integration
- [src/components/](src/components/) — UI components: camera section, confirm capture, analyzing page, vocabulary results, etc.

Explore these files to customize the capture flow, UI, or model prompts.

## How it works (flow)

1. User taps the camera button or uploads an image in the UI.
2. The app shows a confirmation screen (`ConfirmCapture`) where the user can cancel or proceed.
3. On analyze, the app posts the base64 image to Gemini API via `analyzeBookPage()`.
4. The model returns a strict JSON object containing `extractedText` and an array of `words` (word, category, definition, contextual).
5. The UI renders `VocabularyResults` with definitions and the full page text.

## Notes & security

- The app expects the model to return strict JSON. See the prompt and parsing logic in [src/services/geminiService.ts](src/services/geminiService.ts).
- Keep your `VITE_GEMINI_API_KEY` secret. Use server-side proxies or temporary keys for production deployments.

- This project uses the Google Gemini API (specifically `gemini-2.5-flash`) for image analysis, OCR, and vocabulary extraction.

## Future updates (planned)

- Persist scans and user data (Supabase integration hints are present in dependencies).
- Enhance multimodal features or support alternate model configurations.
- Add optional user accounts and sync across devices.
- Improve OCR and fallback extraction for low-quality images.
- Add model-selection UI and safer prompt-handling / rate-limiting.
- Export/import vocabulary lists and spaced-repetition features.
- Mobile PWA support and accessibility improvements.

If you'd like any of these prioritized, open an issue or send a PR.

## Contributing

Contributions are welcome. Open a PR or issue, and include a short description of changes. Follow existing code style (TypeScript + Tailwind) and run `npm run typecheck` and `npm run lint` before submitting.

---

This README was generated to reflect the current project layout and planned future work. Update it as the app grows.

# LixiLens