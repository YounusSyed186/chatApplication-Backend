const userRepo = require("../repositories/user.repository");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

async function register(email, password) {
  const existingUser = await userRepo.findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashed = await hashPassword(password);

  const user = await userRepo.createUser(email, hashed);

  const token = generateToken(user);

  const { password_hash, ...safeUser } = user;

  return { user: safeUser, token };
}

async function login(email, password) {
  const user = await userRepo.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await comparePassword(password, user.password_hash);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);

  const { password_hash, ...safeUser } = user;

  return { user: safeUser, token };
}

async function getCurrentUser(userId) {
  const user = await userRepo.findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const { password_hash, ...safeUser } = user;

  return safeUser;
}

module.exports = {
  register,
  login,
  getCurrentUser
};