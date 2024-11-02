const axios = require('axios');
const fs = require('fs');
const request = require('request');

module.exports = {
  name: 'shoti',
  version: '1.0.0',
  description: 'Generate a random shoti TikTok video',
  author: 'libyzxy0',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      // Notify user that the download is starting
      sendMessage(senderId, { text: 'Downloading...' }, pageAccessToken);

      // Send GET request to the API
      const response = await axios.get('https://shoti.kenliejugarap.com/getvideo.php?apikey=shoti-d3ec12dda0a8fa28409f0322cde8a2f1280193c9ad773540098cb939bc456d879682f8d550834e7dd8213f81c6b3263e9f6ef23c2a75db0bdc478595bade5e1bdf6390d59eaaeb3d23fce3c8b413bfa7f0d74e1723');

      if (response.data.status) {
        const { title, tiktokUrl, videoDownloadLink } = response.data;
        
        // Define the path where the video will be saved
        const path = `${__dirname}/cache/shoti/shoti.mp4`;

        // Create a write stream and download the video
        const file = fs.createWriteStream(path);
        const rqs = request(encodeURI(videoDownloadLink));
        rqs.pipe(file);

        file.on('finish', async () => {
          sendMessage(senderId, { text: 'Downloaded Successfully.' }, pageAccessToken);

          // Send the video as an attachment
          const messageData = {
            recipient: { id: senderId },
            message: {
              attachment: {
                type: 'video',
                payload: {
                  url: `https://your-server.com/path-to-video/${encodeURIComponent(path)}`, // Make sure this path is accessible to Facebook servers
                  is_reusable: true
                }
              }
            }
          };

          // Post the video attachment to Facebook Messenger
          await axios.post(
            `https://graph.facebook.com/v17.0/me/messages?access_token=${pageAccessToken}`,
            messageData
          );

          // Clean up local video file
          fs.unlinkSync(path);
        });

        file.on('error', (err) => {
          sendMessage(senderId, { text: `Error writing file: ${err}` }, pageAccessToken);
        });
      } else {
        sendMessage(senderId, { text: 'Failed to fetch video.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching or sending video:', error);
      sendMessage(senderId, { text: 'An error occurred while fetching the video. Please try again later.' }, pageAccessToken);
    }
  }
};
