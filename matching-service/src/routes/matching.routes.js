const express = require("express");

const router = express.Router();

const controller = require("../controllers/matching.controller");

router.post("/match", controller.matchUsers);

module.exports = router;