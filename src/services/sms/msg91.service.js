import axios from "axios";

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

export const sendOtp = async (phoneNumber) => {
  try {
    const response = await axios.post(
      `https://control.msg91.com/api/v5/otp`,
      {},
      {
        params: {
          template_id: MSG91_TEMPLATE_ID,
          mobile: phoneNumber,
          authkey: MSG91_AUTH_KEY,
        },

        headers: {
          authkey: MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "MSG91 Send OTP Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Unable to send OTP"
    );
  }
};