const express = require("express");
const { createConfession, getConfessions } = require("../controllers/confession.controller");

const router = express.Router();

router.post("/", createConfession);
router.get("/", getConfessions);

module.exports = router;