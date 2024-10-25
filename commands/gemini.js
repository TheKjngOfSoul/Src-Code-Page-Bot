const axios = require('axios');

module.exports = {
  name: 'gemini',
  description: 'Ask a question to the Gemini AI',
  author: 'ChatGPT',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    try {
      sendMessage(senderId, { text: '💬 | 𝙰𝚗𝚜𝚠𝚎𝚛𝚒𝚗𝚐...' }, pageAccessToken);

      // Define the API URL and parameters
      const apiUrl = `https://joshweb.click/gemini?prompt=${encodeURIComponent(prompt)}&uid=100${senderId}`;

      // Make the API request
      const response = await axios.get(apiUrl);

      // Extract the response text (assuming it's in `response.data.gpt4`)
      const text = response.data?.gpt4;
      if (!text) {
        throw new Error("No response text found in API response");
      }

      // Split the response into chunks if it exceeds 2000 characters
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
