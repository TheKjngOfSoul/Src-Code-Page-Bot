const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'random',
  description: 'Generates an image or video',
  author: 'DP',
  async execute(senderId, args, pageAccessToken) {
    const apiUrl = `https://joshweb.click/api/randhntai`;

    try {
      // Fetch the generated media
      const response = await axios.get(apiUrl, { responseType: 'json' });

      if (response.data && response.data.url) {
        // Send the video or image URL to the user
        await sendMessage(senderId, { 
          attachment: { 
            type: 'video', 
            payload: { url: response.data.url } 
          } 
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: 'Error: No media found.' }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error:', error.message);
      await sendMessage(senderId, { text: 'Error: Could not generate video or image.' }, pageAccessToken);
    }
  }
};
