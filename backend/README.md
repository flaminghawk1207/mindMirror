# MindMirror Backend (Gemini AI Chat)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set your Gemini API key:**
   - Create a `.env` file in this directory:
     ```env
     GEMINI_API_KEY=your-gemini-api-key-here
     ```

   - You can get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

3. **Run the server:**
   ```bash
   npm start
   ```

## API

### POST `/api/chat`
- **Body:** `{ "message": "your message here" }`
- **Response:** `{ "reply": "Gemini's response" }` 