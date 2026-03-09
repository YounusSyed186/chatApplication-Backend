const service = require("../services/event.service");

async function suggestEvent(req, res) {
  const { college, message } = req.body;
   const userId = req.user?.id || null;; // from auth middleware

  try {
    const event = await service.suggestEvent(userId, college, message);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function createEvent(req, res) {
  try {
    const { title, description, college, userId } = req.body;

    if (!title || !description || !college) {
      return res.status(400).json({
        error: "title, description and college are required",
      });
    }

    const event = await service.createEventDirect(
      userId || null,
      college,
      { title, description }
    );

    res.json(event);
  } catch (err) {
    console.error("createEvent controller error:", err.message);

    res.status(500).json({
      error: "Failed to create event",
    });
  }
}
async function getTopEvents(req, res) {
  try {
    const { college } = req.query;

    console.log("Getting top events for college:", college);

    const events = await service.getTopEvents(college);

    console.log("Top events count:", events.length);

    res.json(events);
  } catch (err) {
    console.error("Error retrieving top events:", err.message);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { suggestEvent, createEvent, getTopEvents };