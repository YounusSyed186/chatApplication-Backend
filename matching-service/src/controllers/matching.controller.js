const service = require("../services/matching.service");

async function matchUsers(req, res) {

  try {

    const { query } = req.body;

    const matches = await service.matchUsers(query);

    res.json(matches);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

}

module.exports = { matchUsers };