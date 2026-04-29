import axios from "axios"; // Backend eketh import karanna puluwan
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (options) => {
  try {
    const apiKey = process.env.BREVO_PASSWORD; 

    const data = {
      sender: {
        name: process.env.SMTP_FROM_NAME || "Villa Hub",
        email: process.env.SMTP_FROM_EMAIL,
      },
      to: [{ email: options.email }],
      subject: options.subject,
      htmlContent: options.html, // Nodemailer eke 'html' wenas wenawa 'htmlContent' walata
    };

    // Axios backend eke use karana widiya
    const response = await axios.post("https://api.brevo.com/v3/smtp/email", data, {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Email sent via Axios in Backend:", response.data.messageId);
    return response.data;

  } catch (error) {
    console.error("❌ BACKEND AXIOS ERROR:");
    if (error.response) {
      // Brevo eken dena error eka balanna
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    throw new Error("Email sending failed");
  }
};

export default sendEmail;