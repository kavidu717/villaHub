import User from "../models/userModel.js";
import crypto from 'crypto';
import sendEmail from "../utils/sendEmail.js";
import jsonwebtoken from "jsonwebtoken";

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

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try{
     const user =await User.findOne({email})

     if(!user){
      return res.status(400).json({
        success:false,
        message:"email or password is in correct    hi"
      })
     }

     if(!user.isVerified){
      return res.status(400).json({
        success:false,
        message:"Please verify your email before logging in"
      })
     }
     const isMatch = await user.matchPassword(password)

      console.log("--- DEBUG LOGIN ---");
    console.log("Input Password (from Postman):", password);
    console.log("Stored Hashed Password (from DB):", user.password);
    console.log("Do they match?", isMatch);
    console.log("-------------------");



     if(!isMatch){
      return res.status(400).json({
        success:false,
        message:"email or password is in correct"

      })
     }

     const token = jsonwebtoken.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:"7d"})
     const {password:existingPassword,...userWithoutPassword}=user._doc

     res.status(200).json({
      success:true,
      user:userWithoutPassword,
      token
     })
     





  }catch(err){
   res.status(500).
   json(
    {
      success:false,
      message:err.message
    }
   ) 
  }
}

export const getAllUsers = async (req, res) => {
  try{
    const users=await User.find({}).select("-password").sort("-createdAt")

    res.status(200).json({
      success:true,
      count:users.length,
      data:users
    })

  }catch(err){
    res.status(500).
    json(
      {
        success:false,
        message:err.message
      }
    )
  }
}

 export const toggleBlockUser=async(req,res)=>{
  try{
    const user=await User.findById(req.params.id)
    if(!user){
      return res.status(404).json({
        success:false,
        message:"user not found"
      })
    }
    if(user._id.toString()===req.user._id.toString()){
      return res.status(400).json({
        success:false,
        message:"you can't block yourself"
      })

    }

    user.isBlocked=!user.isBlocked
    await user.save()
    res.status(200).json({
      success:true,
      message:"user blocked successfully"
    })

  }catch(err){
    res.status(500).
    json(
      {
        success:false,
        message:err.message
      }
    )
  }
 }

 export const deleteUser=async(req,res)=>{
  try{
    const user=await User.findById(req.params.id)
    if(!user){
      return res.status(404).json({
        success:false,
        message:"user not found"
      })
    }
    await user.findOneAndDelete(req.params.id)
    res.status(200).json({
      success:true,
      message:"user deleted successfully"
    })
  }
  catch(err){
    res.status(500).
    json(
      {
        success:false,
        message:err.message
      }
    )
    
  }
}
      






