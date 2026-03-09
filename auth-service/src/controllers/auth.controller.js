const authService = require("../services/auth.service");

async function register(req, res) {
  try {
    console.log('Register request received for email:', req.body.email);
    const { email, password } = req.body;

    const result = await authService.register(email, password);

    console.log('Register successful for email:', email);
    res.json(result);
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    console.log('Login request received for email:', req.body.email);
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    console.log('Login successful for email:', email);
    res.json(result);
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(400).json({ error: err.message });
  }
}

async function getCurrentUser(req, res) {
  try {
    const userId = req.user.id;

    const user = await authService.getCurrentUser(userId);

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  getCurrentUser
};