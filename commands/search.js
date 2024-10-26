const axios = require('axios');

module.exports = {
  name: 'searchvideo',
  description: 'Search for videos online and send them to the user',
  author: 'Deku',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // Helper function to send a message back to the sender
    const reply = (text) => sendMessage(senderId, { text }, pageAccessToken);

    // Get the search query from the user's input
    const query = args.join(' ');
    if (!query) return reply('Please provide a search term.');

    try {
      // Make a GET request to the video search API
      const apiUrl = `https://joshweb.click/eprnr/search?q=${encodeURIComponent(query)}`;
      const response = await axios.get(apiUrl);

      // Extract video results from the response
      const videos = response.data?.videos || [];
      if (videos.length === 0) {
        return reply(`No videos found for "${query}".`);
      }

      // Limit to the top 3 video results
      const topVideos = videos.slice(0, 3);

      // Send each video link as an individual message with the video URL as an attachment
      for (const video of topVideos) {
        const messageContent = `**${video.title}**\n${video.description}\nURL: ${video.url}`;
        // Send the video link as an attachment (Facebook API allows video URLs to be attached this way)
        await sendMessage(senderId, { text: messageContent, attachment: { type: 'video', url: video.url } }, pageAccessToken);
      }
      
    } catch (error) {
      console.error('Error fetching video results:', error.message);
      reply('There was an error retrieving the videos. Please try again later.');
    }
  }
};
