const axios = require('axios');
const FormData = require('form-data');
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

      // Download the video as a stream
      const videoResponse = await axios.get(videoDownloadUrl, { responseType: 'stream' });

      // Prepare the form data for uploading to Facebook
      const formData = new FormData();
      formData.append('filedata', videoResponse.data, { filename: 'tiktok_video.mp4', contentType: 'video/mp4' });
      formData.append('recipient', JSON.stringify({ id: senderId }));
      formData.append('message', JSON.stringify({ attachment: { type: 'video', payload: {} } }));

      // Send the video to Facebook
      await axios.post(`https://graph.facebook.com/v17.0/me/messages?access_token=${pageAccessToken}`, formData, {
        headers: {
          ...formData.getHeaders()
        }
      });

    } catch (error) {
      console.error('Error:', error.message);
      await sendMessage(senderId, { text: 'Error: Could not retrieve or send video.' }, pageAccessToken);
    }
  }
};
