const axios = require('axios');

const generate = async (voiceId, text) => {
  console.log("Calling Murf API with voice:", voiceId, "text:", text);

  // Sanity check,for the type of text whether its tring or not
  if (typeof text !== 'string') {
    console.error("ERROR: Expected 'text' to be a string but got:", typeof text, text);
    return null;
  }

  try {
    const data = JSON.stringify({
      text: text,        // ✅ Must be a string
      voiceId: voiceId
    });

    const config = {
      method: 'post',
      url: 'https://api.murf.ai/v1/speech/generate',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': process.env.MURF_API_KEY,
      },
      data: data,
    };

    const response = await axios(config);
    return response.data.audioFile; // Confirm this matches Murf API doc
  } catch (error) {
    console.error('❌ Murf API Error:', error.response?.data || error.message);
    return null;
  }
};

module.exports = { generate };
