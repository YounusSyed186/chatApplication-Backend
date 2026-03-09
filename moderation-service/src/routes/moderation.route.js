const express = require("express");
const { checkMessage } = require("../controllers/moderation.controller");

const router = express.Router();

router.post("/", checkMessage);

module.exports = router;