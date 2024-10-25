const axios = require('axios');

module.exports = {
  name: 'gemini',
  description: 'Talk to Gemini (conversational)',
  author: 'Deku',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    
    // Check if there's input text
    if (!prompt) {
      return sendMessage(senderId, { text: 'Please enter a prompt.' }, pageAccessToken);
    }

    try {
      // Indicate that the request is being processed
      sendMessage(senderId, { text: '✨ | Processing your request...' }, pageAccessToken);

      // Define the API URL and handle photo reply logic
      const apiUrl = `https://joshweb.click/gemini?prompt=${encodeURIComponent(prompt)}&uid=100${senderId}`;

      // Check if the event is a reply to a photo message
      if (args.reply && args.reply.attachments[0]?.type === 'photo') {
        const url = encodeURIComponent(args.reply.attachments[0].url);
        const response = await axios.get(`${apiUrl}&url=${url}`);
        const text = response.data?.gpt4 || 'No response from Gemini.';
        return sendMessage(senderId, { text }, pageAccessToken);
      } 

      // If there's no photo reply, send the prompt only
      const response = await axios.get(apiUrl);
      const text = response.data?.gpt4 || 'No response from Gemini.';
      return sendMessage(senderId, { text }, pageAccessToken);

    } catch (error) {
      console.error('Error calling Gemini API:', error.response?.data || error.message);
      return sendMessage(senderId, { text: 'There was an error processing your request. Please try again later.' }, pageAccessToken);
    }
  }
};
