const axios = require('axios');
const fs = require('fs');
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

      // Download the video file
      const videoResponse = await axios.get(videoDownloadUrl, { response
