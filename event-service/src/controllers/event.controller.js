const service = require("../services/event.service");

async function suggestEvent(req, res) {
  const { college, message } = req.body;
  try {
    const event = await service.suggestEvent(college, message);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getTopEvents(req, res) {
  try {
    const { college } = req.query;
    console.log('Getting top events for college:', college);
    const events = await service.getTopEvents(college);
    console.log('Top events count:', events.length);
    res.json(events);
  } catch (err) {
    console.error('Error retrieving top events:', err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { suggestEvent, getTopEvents };