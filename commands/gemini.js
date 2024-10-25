const axios = require('axios');

module.exports = {
  name: 'gemini',
  description: 'Ask a question to Gemini',
  author: 'Deku (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    try {
      const apiUrl = `https://joshweb.click/gemini?prompt=${encodeURIComponent(prompt)}&uid=100${senderId}`;
      const response = await axios.get(apiUrl);

      // Check if gpt4 response exists
      const text = response.data?.gpt4;
      if (!text) {
        throw new Error("No response text found in API response");
      }
      
      // Split response if it exceeds max length
      const maxMessageLength = 2000;
      if (text.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(text, maxMessageLength);
        for (const message of messages) {
          sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error.message);
      sendMessage(senderId, { text: 'There was an error processing your request. Please try again later.' }, pageAccessToken);
    }
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
