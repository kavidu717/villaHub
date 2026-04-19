import User from "../models/userModel.js";
import crypto from 'crypto';
import sendEmail from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ success: false, message: "user already exist" });
    }

    const user = new User({ name, email, password });
    
    // Matched to the typo "genetrateToken" in your model
    const verificationToken = user.genetrateToken("verify"); 
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
    
    const message = `
      <h1>Welcome to StayEase, ${name}!</h1>
      <p>Please click the button below to verify your account:</p>
      <a href="${verifyUrl}" style="background: #fbbf24; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Verify Email
      </a>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Please verify your email",
        html: message
      });

      res.status(200).json({
        success: true,
        message: "User registered successfully! Check your email."
      });

    } catch (err) {
      console.error("SMTP ERROR:", err);
      await User.findOneAndDelete({ email: user.email });
      res.status(500).json({ success: false, message: "Email delivery failed" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  try {
    // Matched to "verifiedToken" and "verifiedTokenExpires" in your model
    const user = await User.findOne({
      verifiedToken: hashedToken, 
      verifiedTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verifiedToken = undefined;
    user.verifiedTokenExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};