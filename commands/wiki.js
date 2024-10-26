const axios = require('axios');

module.exports = {
  name: 'wikipedia',
  description: 'Search and know about any topic',
  author: 'F1NNNMCTIANNN',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      sendMessage(senderId, { text: 'Please provide a search query (e.g., wikipedia Albert Einstein).' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://nash-rest-api-production.up.railway.app/wikipedia?search=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(apiUrl);

      if (response.data.title && response.data.extract) {
        const title = response.data.title;
        const extract = response.data.extract;
        const message = `🎓 𝗪𝗶𝗸𝗶𝗽𝗲𝗱𝗶𝗮 𝗦𝗲𝗮𝗿𝗰𝗵 🔎\n\n 𝗧𝗛𝗘 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 𝗢𝗙➜ "${title}" 𝗜𝗦 \n\n➜ ${extract}`;

        sendMessage(senderId, { text: message }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: `🚫 𝗡𝗼 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗳𝗼𝘂𝗻𝗱 𝗳𝗼𝗿➜ "${searchQuery}".` }, pageAccessToken);
      }
    } catch (error) {
      console.error("🚫 𝗘𝗿𝗿𝗼𝗿 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗪𝗶𝗸𝗶𝗽𝗲𝗱𝗶𝗮 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 :", error);
      sendMessage(senderId, { text: '❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻.' }, pageAccessToken);
    }
  }
};
