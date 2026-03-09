const repo = require("../repositories/confession.repository");
const axios = require("axios");

async function createConfession(college, message) {
  try {
    console.log('Confession service: creating for college', college);
    // Call moderation service to check toxicity
    const mod = await axios.post(process.env.MODERATION_SERVICE_URL, {
      message,
    });

    if (!mod.data.allowed) {
      throw new Error("Message flagged as toxic");
    }

    const confession = await repo.create(college, message);
    console.log('Confession created with id', confession.id || confession._id);
    return confession;
  } catch (err) {
    console.error('createConfession error:', err.message);
    throw err;
  }
}

async function getConfessions(college) {
  try {
    console.log('Fetching confessions for college', college);
    const data = await repo.getByCollege(college);
    return data;
  } catch (err) {
    console.error('getConfessions error:', err.message);
    throw err;
  }
}

module.exports = { createConfession, getConfessions };