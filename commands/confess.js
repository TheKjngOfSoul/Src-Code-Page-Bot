module.exports = {
  name: 'confess',
  description: 'Confess to someone using a Facebook link',
  author: 'Deku',
  async execute(senderId, args, pageAccessToken, sendMessage, api) {
    // Helper function for sending replies in the current thread
    const reply = (text) => sendMessage(senderId, { text }, pageAccessToken);

    // Parse the message and the target Facebook link
    const content = args.join(' ').split('|').map(item => item.trim());
    const text1 = content[0]; // Message to send
    const text2 = content[1]; // Facebook link or username

    // Check for valid input
    if (!args[0] || !text1 || !text2) {
      return reply(`Wrong format. Use ${this.name} [your message] | [Facebook link of the person you want to confess to].`);
    }

    try {
      // Retrieve the UID based on the provided Facebook link
      const res = await api.getUID(text2);
      
      // Send the confession message to the target UID
      await api.sendMessage(
        `Someone (bot user) has sent you a confession! Here is their message:\n\n"${text1}"`,
        res
      );

      // Confirm to the sender that the message was sent
      reply('Confession has been sent successfully!');
    } catch (err) {
      console.error('Error sending confession:', err);
      reply("I'm sorry, but your confession couldn't be sent. Maybe it's time to confess directly! (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)");
    }
  }
};
