const repo = require("../repositories/confession.repository");
const axios = require("axios");

async function createConfession(college, message) {
  try {
    console.log('Confession service: creating for college', college);
    // Call moderation service to check toxicity
    const mod = await axios.post(process.env.MODERATION_SERVICE_URL, {
      message,
    });
    console.log('Moderation response:', mod.data);

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

async function getConfessions(filter) {
  try {
    return await repo.getConfessions(filter);
  } catch (err) {
    console.error("getConfessions error:", err.message);
    throw err;
  }
}
async function getLikes(confessionId) {
  return await repo.getLikes(confessionId);
}

async function likeConfession(confessionId) {
  return await repo.likeConfession(confessionId);
}

module.exports = { createConfession, getConfessions, getLikes, likeConfession };