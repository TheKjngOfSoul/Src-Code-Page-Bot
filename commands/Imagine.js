const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'imagine',
  description: 'Generates an image based on prompt',
  author: 'DP',
  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt for image generation.' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://nethwieginedev.vercel.app/flux?q=dragon${encodeURIComponent(prompt)}`;

      await sendMessage(senderId, { attachment: { type: 'image', payload: { url: apiUrl } } }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Error: Could not generate image.' }, pageAccessToken);
    }
  }
};
