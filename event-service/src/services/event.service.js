const repo = require("../repositories/event.repository");
const axios = require("axios");

async function suggestEvent(college, message) {
  try {
    console.log('Event service: suggesting event for', college);
    // Call moderation service to check message toxicity
    const mod = await axios.post(process.env.MODERATION_SERVICE_URL, {
      message,
    });

    if (!mod.data.allowed) {
      throw new Error("Event suggestion flagged as toxic");
    }

    // Check if event already exists or create new event
    const existingEvent = await repo.createEvent(college, message);
    console.log('Event suggestion result', existingEvent);
    return existingEvent;
  } catch (err) {
    console.error('suggestEvent error:', err.message);
    throw err;
  }
}

async function getTopEvents(college) {
  try {
    console.log('Event service: getting top events for', college);
    const events = await repo.getTopEvents(college);
    return events;
  } catch (err) {
    console.error('getTopEvents error:', err.message);
    throw err;
  }
}

module.exports = { suggestEvent, getTopEvents };