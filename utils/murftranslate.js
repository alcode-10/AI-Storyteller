const axios = require('axios');
require('dotenv').config();

const translateText = async (dialogues, targetLang, apiKey) => {
  apiKey = apiKey || process.env.MURF_API_KEY;
  if (!Array.isArray(dialogues)) throw new Error("Expected dialogues to be an array");

  const translatedDialogues = [];

  for (const text of dialogues) {
    try {
      const response = await axios.post(
        'https://api.murf.ai/v1/text/translate',
        {
          targetLanguage: targetLang,
          texts: [text]
        },
        {
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      const translations = response.data?.translations;
      console.log("🌐 Translation API response:", response.data);

      if (translations && translations.length > 0 && translations[0]?.translated_text) {
        translatedDialogues.push(translations[0].translated_text);
      } else {
        console.warn("⚠️ No valid translation found for:", text);
        translatedDialogues.push(undefined);
      }

    } catch (err) {
      console.error("❌ Translation error for:", text, err.response?.data || err.message);
      translatedDialogues.push(undefined);
    }
  }

  return translatedDialogues;
};

module.exports = translateText;
