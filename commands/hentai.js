const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'random',
  description: 'Generates a random video from the API',
  author: 'DP',
  async execute(senderId, args, pageAccessToken) {
    const apiUrl = `https://joshweb.click/api/randhntai`;

    try {
      // Fetch the response from the API
      const response = await axios.get(apiUrl, { responseType: 'json' });

      console.log('API Response:', response.data); // Log the response to verify content

      if (response.data && response.data.result && response.data.result.length > 0) {
        // Select a random video from the result array
        const randomVideo = response.data.result[Math.floor(Math.random() * response.data.result.length)];

        console.log('Selected Video:', randomVideo.video_1); // Log the selected video URL

        // Send the video URL to the user
        await sendMessage(senderId, { 
          attachment: { 
            type: 'video', 
            payload: { url: randomVideo.video_1 } 
          } 
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: 'Error: No videos found in the response.' }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error:', error.message);
      await sendMessage(senderId, { text: 'Error: Could not retrieve video.' }, pageAccessToken);
    }
  }
};
