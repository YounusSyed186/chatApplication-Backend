const express = require("express");

const router = express.Router();

const controller = require("../controllers/user.controller");
const authenticate = require("../middleware/auth.middleware");

router.post("/profile", authenticate, controller.createProfile);

module.exports = router;