import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = "http://localhost:4000";

const NUM_USERS = 50;

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomUser(i) {
  const colleges = ["Svit", "IIT", "MIT", "Stanford"];
  const branches = ["Computer Science", "IT", "Electronics", "Mechanical"];
  const interestsPool = ["DevOps", "Backend", "Frontend", "AI", "Startups", "Design"];
  
  return {
    email: `user${i}@test.com`,
    password: "password123",
    username: `User${i}`,
    college: randomFromArray(colleges),
    year: Math.ceil(Math.random() * 4),
    branch: randomFromArray(branches),
    interests: [
      randomFromArray(interestsPool),
      randomFromArray(interestsPool)
    ],
    bio: "Hello! I love coding and collaborating on side projects.",
    website: `https://user${i}.example.com`,
    linkedin: "",
    github: "",
    twitter: ""
  };
}

async function seed() {
  for (let i = 1; i <= NUM_USERS; i++) {
    const user = generateRandomUser(i);

    try {
      // 1️⃣ Register
      const registerRes = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: user.password })
      });

      if (!registerRes.ok) {
        console.log(`❌ Failed to register user ${user.email}`);
        continue;
      }

      const registerData = await registerRes.json();
      const token = registerData.token || null; // if your register returns a token

      // 2️⃣ Create profile
      const profileRes = await fetch(`${BASE_URL}/users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          username: user.username,
          college: user.college,
          year: user.year,
          branch: user.branch,
          interests: user.interests,
          bio: user.bio,
          website: user.website,
          linkedin: user.linkedin,
          github: user.github,
          twitter: user.twitter
        })
      });

      if (!profileRes.ok) {
        console.log(`❌ Failed to create profile for ${user.email}`);
        continue;
      }

      console.log(`✅ Created user: ${user.email}`);
    } catch (err) {
      console.error(err);
    }
  }
}

seed();