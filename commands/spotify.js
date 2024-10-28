const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage'); // Correctly import sendMessage

module.exports = {
  name: "spotify",
  description: "Search for a Spotify track using a keyword",
  author: "churchill",

  async execute(senderId, args, pageAccessToken) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      return sendMessage(senderId, {
        text: `Usage: spotify [music title]`
      }, pageAccessToken);
    }

    try {
      const res = await axios.get('https://hiroshi-api.onrender.com/tiktok/spotify', {
        params: { search: searchQuery }
      });

      if (!res || !res.data || res.data.length === 0) {
        throw new Error("No results found");
      }

      const { name: trackName, download, image, track } = res.data[0];

      await sendMessage(senderId, {
        text: `ðŸŽ¶ Now playing: ${trackName}\n\nðŸ”— Spotify Link: ${track}`
      }, pageAccessToken);

      await sendMessage(senderId, {
        attachment: {
          type: "audio",
          payload: {
            url: download
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("Error retrieving the Spotify track:", error);
      sendMessage(senderId, {
        text: `Error retrieving the Spotify track. Please try again or check your input.`
      }, pageAccessToken);
    }
  }
};
