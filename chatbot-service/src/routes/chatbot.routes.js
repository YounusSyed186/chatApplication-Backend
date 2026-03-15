const express = require('express');
const router = express.Router();
const chatbotService = require('../services/chatbot.service');

// POST /chat - handle user query
router.post('/chat', async (req, res) => {
  try {
    const { userId, roomId, query } = req.body;

    const response = await chatbotService.handleChat(
      userId,
      roomId,
      query
    );

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;