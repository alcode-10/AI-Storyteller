const path = require('path');
const User = require('../models/users');

const getprofile = async (req, res) => {
  if (!req.session.user || !req.session.user._id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await User.findById(req.session.user._id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      username: user.username,
      prompts: user.prompts || 0,
      downloads: user.downloads || 0,
      merges: user.merges || 0
    });
  } catch (err) {
    console.error("❌ Error in /api/user/profile:", err);
    res.status(500).json({ error: 'Server error' });
  }
}
const incrementDownloads = async (req, res) => {
  if (!req.session.user || !req.session.user._id) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    await User.findByIdAndUpdate(req.session.user._id, { $inc: { downloads: 1 } });
    res.json({ success: true });
  } catch (err) {
    console.error('Error incrementing downloads:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {getprofile,incrementDownloads};
