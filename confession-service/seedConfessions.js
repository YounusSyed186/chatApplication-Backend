require("dotenv").config();
const db = require("./src/config/db");

async function seedConfessions() {
  const confessions = [
    { college: "MIT", message: "I skipped lectures for 2 weeks and nobody noticed." },
    { college: "MIT", message: "My side project is just copied GitHub code." },
    { college: "Stanford", message: "Everyone talks about startups but I just want sleep." },
    { college: "Harvard", message: "I still Google basic Git commands." },
    { college: "IIT Delhi", message: "Our hackathon project worked only once during demo." },
    { college: "IIT Bombay", message: "I learned Docker yesterday and already hate it." },
    { college: "IIT Madras", message: "I debug by adding console.log everywhere." },
    { college: "MIT", message: "Sometimes I commit code without understanding it." },
    { college: "Stanford", message: "Half of my code works by accident." },
    { college: "Harvard", message: "I once fixed a bug by restarting the server." }
  ];

  try {
    for (const confession of confessions) {
      await db.query(
        `
        INSERT INTO confessions (id, college, message)
        VALUES (gen_random_uuid(), $1, $2)
        `,
        [confession.college, confession.message]
      );
    }

    console.log("✅ Confessions seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedConfessions();