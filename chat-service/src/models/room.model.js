const db = require("../config/db");

async function createRoom(name, members) {
  try {
    const sortedMembers = members.sort(); // prevent [A,B] vs [B,A] duplicates

    // Check if room exists
    const existing = await db.query(
      `SELECT * FROM rooms
       WHERE members @> $1::jsonb AND members @> $2::jsonb`,
      [JSON.stringify([sortedMembers[0]]), JSON.stringify([sortedMembers[1]])]
    );

    if (existing.rows.length > 0) return existing.rows[0];

    // Create new room
    const result = await db.query(
      "INSERT INTO rooms (name, members, admin) VALUES ($1, $2, $3) RETURNING *",
      [name, JSON.stringify(sortedMembers), '[]']
    );

    const room = result.rows[0];

    // Add friend mapping safely
    try {
      await db.query(
        `INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)
         ON CONFLICT (user_id, friend_id) DO NOTHING`,
        [sortedMembers[0], sortedMembers[1]]
      );

      await db.query(
        `INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)
         ON CONFLICT (user_id, friend_id) DO NOTHING`,
        [sortedMembers[1], sortedMembers[0]]
      );
    } catch (friendErr) {
      console.error("Error adding friends mapping:", friendErr.message);
    }

    return room;
  } catch (err) {
    console.error("Error creating room:", err.message);
    throw new Error("Unable to create room. Please try again.");
  }
}

async function getRoomsForUser(userId) {
  try {
    const roomsResult = await db.query(
      `SELECT * FROM rooms
       WHERE members @> $1::jsonb`,
      [JSON.stringify([userId])]
    );

    const rooms = roomsResult.rows;

    const friendsResult = await db.query(
      `SELECT u.id, u.username, f.user_id AS owner
   FROM users u
   JOIN friends f ON u.id = f.friend_id
   WHERE f.user_id = $1`,
      [userId]
    );

    const friendsMap = {};
    friendsResult.rows.forEach(f => {
      friendsMap[f.id] = { id: f.id, username: f.username, avatarUrl: "" }; // leave avatar empty
    });

    return rooms.map(room => {
      const friendId = room.members.find(id => id !== userId);
      return { ...room, friend: friendsMap[friendId] || null };
    });

  } catch (err) {
    console.error("Error fetching rooms:", err.message);
    throw new Error("Unable to fetch rooms. Please try again.");
  }
}

module.exports = {
  createRoom,
  getRoomsForUser,
};