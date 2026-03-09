const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat.controller");

router.get("/messages/:roomId", chatController.getMessages);
router.post("/rooms", chatController.createRoom);

module.exports = router;