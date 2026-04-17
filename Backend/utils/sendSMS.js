const axios = require("axios");

const sendSMS = async (phone, message) => {
  try {
    const res = await axios.get(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        params: {
          authorization: process.env.FAST2SMS_API_KEY,
          route: "q",
          message: message,
          numbers: phone,
          flash: 0
        }
      }
    );

    console.log("SMS sent:", res.data);

  } catch (error) {
    console.log("SMS error:", error.response?.data || error.message);
  }
};

module.exports = sendSMS;