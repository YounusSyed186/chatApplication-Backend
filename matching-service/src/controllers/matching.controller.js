const service = require("../services/matching.service");

async function matchUsers(req, res) {
  try {
    let queryString = "";

    // Raw string payload
    if (typeof req.body === "string") {
      queryString = req.body;
    }
    // Object payload
    else if (typeof req.body === "object" && req.body !== null) {
      // If frontend sends { query }
      if (req.body.query) {
        queryString = req.body.query;
      } else {
        // Combine fields into a single string
        const { bio, interests, college, year, branch } = req.body;
        queryString = [
          bio || "",
          Array.isArray(interests) ? interests.join(", ") : interests || "",
          college || "",
          year || "",
          branch || "",
        ]
          .filter(Boolean)
          .join(" ");
      }
    } else {
      return res.status(400).json({ error: "Invalid request body" });
    }

    if (!queryString.trim()) {
      return res.status(400).json({ error: "No data provided for matching" });
    }

    console.log("Matching service: matching query", queryString);

    const matches = await service.matchUsers(queryString);
    res.json(matches);
  } catch (err) {
    console.error("matchUsers controller error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { matchUsers };