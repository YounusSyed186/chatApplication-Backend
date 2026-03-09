const repo = require("../repositories/matching.repository");
const generateEmbedding = require("../utils/embedding");

async function matchUsers(query) {
  try {
    console.log('Matching service: matching query', query);
    const embedding = await generateEmbedding(query);
    const matches = await repo.findMatches(embedding);
    return matches;
  } catch (err) {
    console.error('matchUsers error:', err.message);
    throw err;
  }
}

module.exports = { matchUsers };