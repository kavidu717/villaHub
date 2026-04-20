import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["guest", "admin"],
        default: "guest"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedToken: {
        type: String
    },
    verifiedTokenExpires: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpires: {
        type: Date
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordTokenExpires: {
        type: Date
    },
}, { timestamps: true });

// --- FIXED PRE-SAVE HOOK ---
userSchema.pre("save", async function () {
    // If the password field IS NOT modified (e.g. during email verification), 
    // we MUST return next() to stop the hashing logic.
    if (!this.isModified("password")) {
        return;
    }

    // This only runs during registration or password resets
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords during login
userSchema.methods.matchPassword = async function (enterpassword) {
    return await bcrypt.compare(enterpassword, this.password);
};

// Method to generate various tokens
userSchema.methods.genetrateToken = function (type) {
    const token = crypto.randomBytes(20).toString("hex");
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    if (type === "verify") {
        this.verifiedToken = hashToken;
        this.verifiedTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    } 
    else if (type === "reset") {
        this.resetPasswordToken = hashToken;
        this.resetPasswordTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    }
    
    return token;
};

export default mongoose.model("User", userSchema);