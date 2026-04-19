import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT), // IMPORTANT: convert to number
      secure: false, // true only for port 465
      auth: {
        user: process.env.EMAIL,
        pass: process.env.BREVO_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", result.messageId);

    return result;

  } catch (error) {
    console.log("❌ EMAIL ERROR:");
    console.log(error); // 🔥 this gives exact error

    throw new Error("Email sending failed");
  }
};

export default sendEmail;