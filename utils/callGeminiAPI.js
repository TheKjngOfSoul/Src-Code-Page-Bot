const axios = require('axios');

async function callGeminiAPI(prompt) {
  try {
    const apiUrl = `https://joshweb.click/gemini?prompt=describe%20this%20photo&url=${encodeURIComponent(prompt)}&id=40`;
    const response = await axios.get(apiUrl);
    return response.data.response;
  } catch (error) {
    throw new Error(`Gemini API call failed: ${error.message}`);
  }
}

module.exports = { callGeminiAPI };
