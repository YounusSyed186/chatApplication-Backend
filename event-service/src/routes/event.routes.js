const express = require("express");
const { suggestEvent, getTopEvents, createEvent } = require("../controllers/event.controller");

const router = express.Router();

router.post("/suggest", suggestEvent);
router.get("/top", getTopEvents);
router.post("/create", createEvent);

module.exports = router;