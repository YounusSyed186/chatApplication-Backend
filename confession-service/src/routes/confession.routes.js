const express = require("express");
const { createConfession, getConfessions, getLikes, likeConfession } = require("../controllers/confession.controller");

const router = express.Router();

router.post("/", createConfession);
router.get("/", getConfessions);
router.get("/:id/likes", getLikes);
router.post("/:id/like", likeConfession);

module.exports = router;