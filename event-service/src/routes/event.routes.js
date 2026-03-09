const express = require("express");
const { suggestEvent, getTopEvents } = require("../controllers/event.controller");

const router = express.Router();

router.post("/suggest", suggestEvent);
router.get("/", getTopEvents);

module.exports = router;