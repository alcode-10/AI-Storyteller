const bcrypt = require('bcryptjs');
const User = require('../models/users');

const signup = async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ error: 'User already Exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed, prompts: 0, downloads: 0, merges: 0 });
  await user.save();
  res.status(200).send('Signup Success');
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).send('Invalid Username');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).send('Incorrect Password');
  req.session.user = { _id: user._id };
  res.redirect('/profile.html');
};

module.exports = { signup, login };