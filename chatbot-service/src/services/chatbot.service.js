const Groq = require("groq-sdk");
const MessageModel = require("../models/message.model");
const generateEmbedding = require("../utils/embedding");
const {
  getUserContext,
  getFriends,
  getRelevantEvents
} = require("./context.service");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function handleChat(userId, roomId, query, options = {}) {
  try {
    const { useFullHistory = false } = options;

    // 1️⃣ Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);
    console.log("roomId:", roomId);

    // 2️⃣ Retrieve messages (RAG or full history)
    const messages = useFullHistory
      ? await MessageModel.getRoomHistory(roomId)
      : await MessageModel.getRelevantMessages(roomId, queryEmbedding);

    // 3️⃣ Fetch structured context
    const user = await getUserContext(userId);
    const friends = await getFriends(userId);

    // 4️⃣ Optional: fetch events if relevant
    let events = [];
    if (query.toLowerCase().includes("event")) {
      events = await getRelevantEvents(queryEmbedding);
    }

    // 5️⃣ Build chat context
    const chatContext = messages
      .map(msg =>
        `${msg.sender_id === userId ? "User" : "Other"}: ${msg.content}`
      )
      .join("\n");

    // 6️⃣ Final combined context
    const finalContext = `
User Profile:
Name: ${user?.username || "Unknown"}
Bio: ${user?.bio || "N/A"}
Interests: ${user?.interests || "N/A"}
College: ${user?.college || "N/A"}

Friends:
${friends.length ? friends.map(f => f.username).join(", ") : "No friends found"}

Chat History:
${chatContext || "No chat history available"}

Relevant Events:
${events.length ? events.map(e => `${e.title} - ${e.description}`).join("\n") : "No relevant events"}
`;

    // 7️⃣ LLM call
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You are an intelligent assistant inside a social chat application.

Use:
- Chat history for conversation memory
- User profile for personalization
- Friends for social context
- Events if relevant

Rules:
- If answer is not in context, say it clearly
- Do NOT hallucinate user data
- Keep answers natural and helpful`
        },
        {
          role: "user",
          content: `${finalContext}\n\nUser Question: ${query}`
        }
      ]
    });

    const answer = completion.choices[0]?.message?.content || "";

    return {
      answer,
      context: messages
    };

  } catch (err) {
    if (err.status === 429) {
      return {
        answer: "Too many requests right now. Please try again shortly.",
        context: []
      };
    }

    console.error("Chatbot error:", err);
    throw new Error("Chatbot failed");
  }
}

module.exports = { handleChat };