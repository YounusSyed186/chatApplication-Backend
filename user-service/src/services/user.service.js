const repo = require("../repositories/user.repository");
const generateEmbedding = require("../utils/embedding");

async function createProfile(data) {
  try {

    const text = `
College: ${data.college}
Branch: ${data.branch}
Year: ${data.year}
Interests: ${data.interests}
Bio: ${data.bio}
`;

    const embedding = await generateEmbedding(text);

    await repo.updateProfile({
      ...data,
      embedding
    });

    return { message: "Profile created" };

  } catch (err) {
    console.error("createProfile error:", err.message);
    throw err;
  }
}

async function getUsers() {
  try {
    const users = await repo.getAllUsers();
    return users;
  } catch (err) {
    console.error("getUsers error:", err.message);
    throw err;
  }
}

module.exports = { createProfile, getUsers };