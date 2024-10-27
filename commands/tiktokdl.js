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
      const videoDownloadUrl = response.data.url;

      if (!videoDownloadUrl) {
        await sendMessage(senderId, { text: 'Error: Could not retrieve video download link.' }, pageAccessToken);
        return;
      }

      // Download the video as a buffer
      const videoResponse = await axios.get(videoDownloadUrl, { responseType: 'arraybuffer' });
      const videoBuffer = Buffer.from(videoResponse.data, 'binary');

      // Send the video as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'video',
          payload: {
            is_reusable: true
          }
        },
        filedata: videoBuffer
      }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error.message);
      await sendMessage(senderId, { text: 'Error: Could not retrieve or send video.' }, pageAccessToken);
    }
  }
};
