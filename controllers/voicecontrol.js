// controllers/voicecontrol.js
const { generate } = require("../utils/murfapi");
const murfTranslate = require("../utils/murftranslate");

const characterVoices = {
  Narrator: "en-US-maverick",
  Jack: "en-US-miles",
  Anna: "en-US-natalie",
  Ayushi: "hi-IN-ayushi",
  Kabir: "hi-IN-kabir",
};

const generatevoices = async (req, res) => {
  console.log("📥 Request received:", req.body);
  const { script, voiceMap = {}, translateto, apiKey } = req.body;

  if (!script || typeof script !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "Script is missing or invalid" });
  }

  try {
    // Step 1: Parse the script
    const lines = script
  .split("\n")
  .map(line => line.trim())
  // Only lines that look like character dialogue: a word or name + colon + some dialogue
  .filter(line => /^[A-Za-z][A-Za-z0-9 ]*:\s*.+/.test(line));

const structure = lines.map(line => {
  const [character, ...dialogueArr] = line.split(":");
  return {
    character: character.trim(),
    dialogue: dialogueArr.join(":").trim(),
  };
});


    // Step 2: Translate (if needed)
    if (translateto && translateto !== "none") {
      const dialogues = structure.map((item) => item.dialogue);
      try {
        const translatedDialogues = await murfTranslate(
          dialogues,
          translateto,
          apiKey
        );
        console.log("TranslatedDialogues:", translatedDialogues);
        console.log("Original Structure Length:", structure.length);
        console.log(
          "✅ Translated Dialogues Length:",
          translatedDialogues.length
        );

        structure.forEach((item, index) => {
          item.dialogue = translatedDialogues[index] || item.dialogue; // fallback if translation failed
        });
      } catch (err) {
        console.error("Translation error:", err.message);
        return res
          .status(500)
          .json({ success: false, error: "Translation failed" });
      }
    }

    // Step 3: Generate audio
    const audiores = [];

    for (const line of structure) {
      const voiceid =
        voiceMap[line.character] ||
        characterVoices[line.character] ||
        characterVoices["Narrator"];
      console.log(
        `🔊 Generating for ${
          line.character
        } | Text Type: ${typeof line.dialogue} | Dialogue:`,
        line.dialogue
      );
      const audiourl = await generate(voiceid, line.dialogue);

      if (!audiourl) throw new Error(`Failed audio for ${line.character}`);

      audiores.push({ ...line, voiceid, audiourl });
    }

    return res.json({ success: true, data: audiores });
  } catch (error) {
    console.error("Voice generation error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Server error during voice generation" });
  }
};

module.exports = { generatevoices };
