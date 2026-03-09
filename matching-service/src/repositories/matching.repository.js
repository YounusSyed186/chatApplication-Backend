const db = require("../config/db");

async function findMatches(embedding, college, year, branch, interests) {
  try {
    const embeddingString = `[${embedding.join(",")}]`;

    let filters = [];
    let values = [embeddingString];
    let index = 2;

    if (college) {
      filters.push(`u.college = $${index++}`);
      values.push(college);
    }

    if (year) {
      filters.push(`u.year >= $${index++}`);
      values.push(year);
    }

    if (branch) {
      filters.push(`u.branch = $${index++}`);
      values.push(branch);
    }

    if (interests) {
      filters.push(`u.interests ILIKE $${index++}`);
      values.push(`%${interests}%`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const query = `
  SELECT
    u.id,
    u.college,
    u.year,
    u.branch,
    u.interests,
    1 - (e.embedding <=> $1::vector) AS similarity
  FROM user_embeddings e
  JOIN users u ON u.id = e.user_id
  ${whereClause}
  ORDER BY e.embedding <=> $1::vector
  LIMIT 5
  `;

    const result = await db.query(query, values);
    return result.rows;
  } catch (err) {
    console.error('Matching repository findMatches error:', err.message);
    throw err;
  }
}

module.exports = { findMatches };