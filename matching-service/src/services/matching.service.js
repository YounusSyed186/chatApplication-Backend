const repo = require("../repositories/matching.repository");
const generateEmbedding = require("../utils/embedding");

async function matchUsers(queryString) {
  try {
    console.log("Generating embedding for:", queryString);
    const embedding = await generateEmbedding(queryString); // always string
    const matches = await repo.findMatches(embedding);
    return matches;
  } catch (err) {
    console.error("matchUsers service error:", err);
    throw err;
  }
}

module.exports = { matchUsers };