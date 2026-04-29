import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (options) => {
  try {
    const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_PASSWORD;
    const fromEmail = process.env.SMTP_FROM_EMAIL;
    const fromName = process.env.SMTP_FROM_NAME || "Villa Hub";

    if (!apiKey) {
      throw new Error("Missing Brevo API key. Set BREVO_API_KEY in the environment.");
    }

    if (apiKey.startsWith("xsmtpsib-")) {
      throw new Error("BREVO_API_KEY must be a Brevo API key (xkeysib-...), not the SMTP password (xsmtpsib-...).");
    }

    if (!fromEmail) {
      throw new Error("Missing SMTP_FROM_EMAIL in the environment.");
    }

    const data = {
      sender: {
        name: fromName,
        email: fromEmail,
      },
      to: [{ email: options.email }],
      subject: options.subject,
      htmlContent: options.html,
    };

    const response = await axios.post("https://api.brevo.com/v3/smtp/email", data, {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    console.log("Email sent via Axios in Backend:", response.data.messageId);
    return response.data;
  } catch (error) {
    const apiError = error.response?.data;

    console.error("BACKEND AXIOS ERROR:", apiError || error.message);
    throw new Error(`Email sending failed: ${apiError?.message || error.message}`);
  }
};

export default sendEmail;
