import nodemailer from "nodemailer";


const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.BREVO_PASSWORD,
        },
    });
    const mailOptions = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };
    await transporter.sendMail(mailOptions);
};