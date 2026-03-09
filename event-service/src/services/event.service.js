const repo = require("../repositories/event.repository");
const axios = require("axios");

/**
 * Suggest an event (goes through moderation first)
 */
async function suggestEvent(userId, college, message) {
  try {
    console.log("Event service: suggesting event for", college);

    if (!message || !message.title || !message.description) {
      throw new Error("Invalid event message payload");
    }

    // Call moderation service
    let modResponse;

    try {
      modResponse = await axios.post(process.env.MODERATION_SERVICE_URL, {
        message: `${message.title} ${message.description}`,
      });
    } catch (modErr) {
      console.error("Moderation service failed:", modErr.message);
      throw new Error("Moderation service unavailable");
    }

    if (!modResponse.data || modResponse.data.allowed === false) {
      throw new Error("Event suggestion flagged as toxic");
    }

    // Create event
    const event = await repo.createEvent(userId, college, message);

    console.log("Event suggestion created:", event.id);

    return event;
  } catch (err) {
    console.error("suggestEvent error:", err.message);
    throw err;
  }
}

/**
 * Create event directly (no moderation)
 */
async function createEventDirect(userId, college, message) {
  try {
    console.log("Event service: creating event directly");

    if (!message || !message.title || !message.description) {
      throw new Error("Invalid event data");
    }

    const event = await repo.createEvent(userId, college, message);

    console.log("Event created:", event.id);

    return event;
  } catch (err) {
    console.error("createEventDirect error:", err.message);
    throw err;
  }
}

/**
 * Get top events by ranking
 */
async function getTopEvents(college) {
  try {
    console.log("Event service: getting top events for", college);

    // if (!college) {
    //   throw new Error("College is required");
    // }

    const events = await repo.getTopEvents(college);

    return events;
  } catch (err) {
    console.error("getTopEvents error:", err.message);
    throw err;
  }
}

module.exports = {
  suggestEvent,
  createEventDirect,
  getTopEvents,
};