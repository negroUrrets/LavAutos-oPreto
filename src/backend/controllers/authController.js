const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body, req.session);
  res.status(200).json({ success: true, data });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.session);
  res.status(204).send();
});

const session = asyncHandler(async (req, res) => {
  const data = authService.getSession(req.session);
  res.status(200).json({ success: true, data });
});

module.exports = { login, logout, session };
