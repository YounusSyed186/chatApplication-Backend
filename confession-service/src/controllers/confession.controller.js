const service = require("../services/confession.service");

async function createConfession(req, res) {
  const { college, message } = req.body;

  try {
    const confession = await service.createConfession(college, message);
    res.json(confession);

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

async function getConfessions(req, res) {
  try {
    const { college } = req.query;
    console.log('Fetching confessions for college:', college);
    const data = await service.getConfessions(college);
    console.log('Returned', data.length, 'confessions');
    res.json(data);
  } catch (err) {
    console.error('Error fetching confessions:', err.message);
    res.status(500).json({ error: err.message });
  }
}
async function getLikes(req, res) {
  try {
    const { id } = req.params;

    const likes = await service.getLikes(id);

    res.json(likes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function likeConfession(req, res) {
  try {
    const { id } = req.params;

    console.log("LIKE REQUEST ID:", id);

    const likes = await service.likeConfession(id);

    res.json(likes);
  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}


module.exports = { createConfession, getConfessions, getLikes, likeConfession };