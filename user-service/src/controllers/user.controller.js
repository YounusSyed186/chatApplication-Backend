const service = require("../services/user.service");

async function createProfile(req, res) {
  try {
    console.log("req.user:", req.user); // Add this line to debug
    const userId = req.user.id; // Ensure this matches your JWT payload key

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in token" });
    }

    const result = await service.createProfile({
      userId,
      ...req.body
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createProfile };