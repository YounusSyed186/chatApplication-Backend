const express = require("express");

const router = express.Router();

const controller = require("../controllers/user.controller");
const authenticate = require("../middleware/auth.middleware");

router.post("/profile", authenticate, controller.createProfile);
router.get("/", authenticate, controller.getUsers);
module.exports = router;