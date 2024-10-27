
const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'tiktokdl',
  description: 'Downloads a TikTok video based on the provided URL',
  author: 'DP',
  async execute(senderId, args, pageAccessToken) {
    // Check if a URL is provided as an argument
    if (!args || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a TikTok video URL.' }, pageAccessToken);
      return;
    }

    const videoUrl = args[0];
    const apiUrl = `https://joshweb.click/tiktokdl?url=${encodeURIComponent(videoUrl)}`;

    try {
      // Fetch the video download link from the API
      const response = await axios.get(apiUrl, { responseType: 'json' });

      console.log('API Response:', response.data); // Log the response for debugging

      if (response.data.error) {
        // If there's an error in the response, send the error message
        await sendMessage(senderId, { text: `Error: ${response.data.error}` }, pageAccessToken);
      } else if (response.data.video_url) {
        // If a download link is found, send it to the user
        const downloadLink = response.data.video_url;

        await sendMessage(senderId, {
          text: `Here’s your TikTok video download link:\n${downloadLink}`
        }, pageAccessToken);
      } else {
        // If no specific error or link, send a generic error message
        await sendMessage(senderId, { text: 'Error: Could not retrieve video download link.' }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error:', error.message);
      await sendMessage(senderId, { text: 'Error: Could not retrieve video download link.' }, pageAccessToken);
    }
  }
};
