# Chatbot Service

This service provides retrieval-augmented generation (RAG) for chat queries.

## Features
- Receives user queries via POST /chat
- Generates embeddings using Gemini API
- Retrieves relevant messages using vector similarity
- Prepares context for generative response (Groq/Gemini)

## Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Ensure GEMINI_API_KEY is set in your environment.
3. Start the service:
   ```bash
   pnpm dev
   ```

## Endpoints
- `POST /chat` — Receives `{ userId, roomId, query }`, returns relevant messages.

## Next Steps
- Integrate Groq/Gemini API for generative responses.
- Add authentication and error handling as needed.
