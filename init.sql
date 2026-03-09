-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table (combined from auth and user services)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  username VARCHAR(255),
  college VARCHAR(255),
  year INTEGER,
  branch VARCHAR(255),
  interests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User embeddings table
CREATE TABLE IF NOT EXISTS user_embeddings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  embedding vector(768), -- Adjust dimension as needed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table for chat
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  members JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table for chat
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Confessions table
CREATE TABLE IF NOT EXISTS confessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  college VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  likes INTEGER DEFAULT 0,
  demand_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample event data
INSERT INTO events (college, title, description, likes, demand_count) VALUES
  ('MIT', 'Tech Hackathon 2026', 'Join us for the biggest hackathon of the year! Build amazing projects and win prizes.', 45, 120),
  ('Stanford', 'AI Workshop Series', 'Learn cutting-edge AI and ML techniques from industry experts. Free registration!', 32, 85),
  ('Harvard', 'Startup Pitch Night', 'Showcase your startup ideas to investors and fellow entrepreneurs.', 28, 60),
  ('MIT', 'Campus BBQ', 'Come grab some food and meet new people on campus. Friday evening at the quad!', 15, 40),
  ('Stanford', 'Career Networking Fair', 'Connect with top tech companies and learn about career opportunities.', 38, 95)
ON CONFLICT DO NOTHING;