const generateEmbedding = require('../utils/embedding');
const MessageModel = require('../models/message.model');
const Groq = require("groq-sdk");

// Initialize Groq with your API Key from .env
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function handleChat(userId, roomId, query) {
  try {
    // 1️⃣ Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);

    // 2️⃣ Retrieve relevant messages
    const relevantMessages = await MessageModel.getRelevantMessages(
      roomId,
      queryEmbedding
    );

    // 3️⃣ Build chat context
    const context = relevantMessages
      .map(msg => `${msg.sender_id === userId ? 'User' : 'Other'}: ${msg.content}`)
      .join("\n");

    // 4️⃣ Send request to Groq
    // llama-3.3-70b-versatile is excellent for reasoning and context
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Use the provided chat history to answer questions. If the answer isn't in history, use general knowledge but clarify that history was insufficient."
        },
        {
          role: "user",
          content: `Chat history:\n${context}\n\nUser question: ${query}`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const answer = chatCompletion.choices[0]?.message?.content || "";

    return {
      answer,
      context: relevantMessages
    };

  } catch (err) {
    // Groq specific rate limit error (429)
    if (err.status === 429) {
      console.error("Groq Rate Limit Hit");
      return {
        answer: "I'm processing too many messages right now. Please try again in a moment.",
        context: []
      };
    }

    console.error("Groq Chatbot error:", err);
    throw new Error("Chatbot failed");
  }
}

module.exports = { handleChat };