
const axios = require('axios');
module.exports = {
  name: 'RandomVideo',
  description: 'Send a random video from API',
  author: 'Deku (rest api)',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      // Make a request to the API that provides the random video
      const apiUrl = 'https://joshweb.click/api/randhntai';
      const response = await axios.get(apiUrl);
      const videoUrl = response.data.videoUrl; // Assuming the API response has a 'videoUrl' field

      // Check if video URL exists and send it
      if (videoUrl) {
        sendMessage(senderId, { text: `Here’s a random video for you: ${videoUrl}` }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'No video found. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching random video:', error);
      sendMessage(senderId, { text: 'An error occurred while fetching the video. Please try again later.' }, pageAccessToken);
    }
  }
};
