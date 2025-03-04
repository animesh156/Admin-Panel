 const sendNotification = async (req, res) => {
    const { title, message } = req.body;
  
    // Simulated notification logic (WeHR PWA should be configured to receive)
    console.log(`Sending Notification: ${title} - ${message}`);
  
    res.json({ message: "Notification sent successfully" });
  };
  
  module.exports = {
    sendNotification
  }