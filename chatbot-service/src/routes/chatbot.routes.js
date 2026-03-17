const express = require('express');
const router = express.Router();
const { handleChat } = require('../services/chatbot.service');

router.post('/chat', async (req, res) => {
  try {
    const { userId, roomId, query } = req.body;

    const result = await handleChat(userId, roomId, query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
