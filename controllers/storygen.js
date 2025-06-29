const { CohereClient } = require("cohere-ai");
const User = require("../models/users"); 
require("dotenv").config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const generateStory = async (req, res) => {
  const user = req.session.user;
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, error: "Prompt Required" });
  }
  

  try {
    const response = await cohere.generate({
      model: "command-r-plus",
      prompt: `Write a short, creative story in dialogue format (like a play). Make it fun, character-driven, and engaging.\nPrompt: ${prompt}`,
      max_tokens: 600,
      temperature: 0.8
    });

    const script = response.generations[0].text.trim();

    // ✅ Increment prompt count
   if (user && user._id) {
  await User.findByIdAndUpdate(user._id, { $inc: { prompts: 1 } });
}


    res.json({ success: true, script });
  } catch (err) {
    console.error("Cohere API error:", err);
    res.status(500).json({ success: false, error: "Failed to generate story" });
  }
};

module.exports = { generateStory };
