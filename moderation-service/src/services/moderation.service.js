require("dotenv").config();
const axios = require("axios");

async function analyzeToxicity(message) {
  try {
    // 1. Define the model and the URL correctly
    const model = "gemini-1.5-flash-latest";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.TOXICITY_MODEL_API_KEY}`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [
            {
              text: `Analyze this message for toxicity. 
              
Return JSON only:
{
  "toxicity_score": 0.0,
  "allowed": true
}

Message: "${message}"`
            }
          ]
        }
      ],
      generationConfig: {
        response_mime_type: "application/json"
      }
    });

    // Extract the text from the response
    const text = response.data.candidates[0].content.parts[0].text;

    // 2. Parse the JSON (API returns a string)
    const result = JSON.parse(text);

    return result;

  } catch (err) {
    // Log the actual error for your debugging
    console.error("Toxicity API error:", err.response?.data || err.message);

    // 3. Fallback logic: 
    // If the message is highly suspicious (e.g., contains "bitch"), 
    // we block it locally if the API fails.
    const lowcaseMsg = message.toLowerCase();
    const manualBlock = ["bitch", "f***"].some(word => lowcaseMsg.includes(word));

    return {
      toxicity_score: manualBlock ? 1 : 0,
      allowed: !manualBlock 
    };
  }
}

module.exports = { analyzeToxicity };