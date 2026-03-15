const db = require("../config/db");

async function createRoom(name, members) {
  try {
    // 1. Normalize members to ensure consistent lookups
    const sortedMembers = [...members].sort(); 

    // 2. Check if a private room with these exact two members already exists
    // Using jsonb @> operator and length check to ensure it's a 1v1 room
    const existing = await db.query(
      `SELECT * FROM rooms
       WHERE name = $1 
       AND members @> $2::jsonb 
       AND jsonb_array_length(members) = 2`,
      [name, JSON.stringify(sortedMembers)]
    );

    if (existing.rows.length > 0) return existing.rows[0];

    // 3. Create new room if it doesn't exist
    const result = await db.query(
      "INSERT INTO rooms (name, members, admin) VALUES ($1, $2, $3) RETURNING *",
      [name, JSON.stringify(sortedMembers), '[]']
    );

    const room = result.rows[0];

    // 4. Handle Friend Mapping (only for 1v1 private rooms)
    if (name === 'private' && sortedMembers.length === 2) {
      try {
        // We use a subquery check to ensure BOTH members exist in the users table
        // This prevents the Chatbot ID from breaking the friendship logic
        await db.query(
          `INSERT INTO friends (user_id, friend_id)
           SELECT $1, $2
           WHERE EXISTS (SELECT 1 FROM users WHERE id = $1)
             AND EXISTS (SELECT 1 FROM users WHERE id = $2)
           ON CONFLICT (user_id, friend_id) DO NOTHING`,
          [sortedMembers[0], sortedMembers[1]]
        );

        await db.query(
          `INSERT INTO friends (user_id, friend_id)
           SELECT $1, $2
           WHERE EXISTS (SELECT 1 FROM users WHERE id = $1)
             AND EXISTS (SELECT 1 FROM users WHERE id = $2)
           ON CONFLICT (user_id, friend_id) DO NOTHING`,
          [sortedMembers[1], sortedMembers[0]]
        );
      } catch (friendErr) {
        // Log it, but don't fail the room creation. 
        // A chatbot room doesn't strictly need a 'friend' record.
        console.warn("Friendship mapping skipped or failed:", friendErr.message);
      }
    }

    return room;
  } catch (err) {
    // 5. Handle Race Conditions
    // If two requests hit at the exact same time, the DB index might block one.
    if (err.code === '23505') { 
      const retry = await db.query(
        "SELECT * FROM rooms WHERE name = $1 AND members @> $2::jsonb",
        [name, JSON.stringify([members[0]])]
      );
      return retry.rows[0];
    }

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