const { analyzeToxicity } = require("../services/moderation.service");

async function checkMessage(req, res) {
  try {
    const { message } = req.body;
    console.log('Moderation request for message:', message);
    const result = await analyzeToxicity(message);
    console.log('Moderation result:', result);
    res.json(result);
  } catch (err) {
    console.error('Moderation error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { checkMessage };