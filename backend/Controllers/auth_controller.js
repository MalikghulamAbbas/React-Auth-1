const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../Models/user');

// In-memory storage for reset tokens
const passwordResetTokens = new Map();

const register = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ message: "User already exists, Login now", success: false });
        }
        const newUser = new User({ name, email, password });
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", success: true });
    } catch(err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const errorMsg = "Invalid email or password";
        if(!user){
            return res.status(403).json({ message: errorMsg, success: false });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(403).json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
             message: "Logged in successfully", 
             success: true,
             jwtToken,
             email,
             name: user.name 
            });
    } catch(err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            message: "Internal Server Error", 
            success: false 
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        console.log('Forgot password request for:', email);
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found, but returning success for security');
            // For security reasons, don't reveal if email exists or not
            return res.status(200).json({ 
                message: "If the email exists, a password reset link has been sent", 
                success: true 
            });
        }
        
        console.log('User found:', user._id.toString());
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        
        // Store token in memory
        passwordResetTokens.set(resetToken, {
            userId: user._id.toString(),
            email: user.email,
            expires: resetTokenExpiry
        });
        
        console.log('Token stored. Current tokens:', Array.from(passwordResetTokens.keys()));
        
        // In a real app, send email here. For testing, return token in response
        res.status(200).json({ 
            message: "If the email exists, a password reset link has been sent", 
            success: true,
            resetToken: resetToken // Remove this in production
        });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ 
            message: "Internal Server Error", 
            success: false 
        });
    }
};

const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.body;
        
        console.log('Verifying token:', token);
        console.log('Available tokens:', Array.from(passwordResetTokens.keys()));
        
        // Check if token exists and is valid
        const tokenData = passwordResetTokens.get(token);
        if (!tokenData) {
            console.log('Token not found');
            return res.status(400).json({ 
                message: "Invalid or expired reset token", 
                success: false 
            });
        }
        
        // Check if token has expired
        if (Date.now() > tokenData.expires) {
            // Clean up expired token
            passwordResetTokens.delete(token);
            console.log('Token expired');
            return res.status(400).json({ 
                message: "Reset token has expired", 
                success: false 
            });
        }
        
        console.log('Token valid for user:', tokenData.email);
        
        res.status(200).json({ 
            message: "Reset token is valid", 
            success: true,
            email: tokenData.email
        });
    } catch (err) {
        console.error('Verify token error:', err);
        res.status(500).json({ 
            message: "Internal Server Error", 
            success: false 
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        // Add safety check for req.body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                message: "Request body is missing", 
                success: false 
            });
        }
        
        const { token, password } = req.body;
        
        console.log('Reset password request with token:', token);
        console.log('Request body:', req.body);
        
        // Check if token exists and is valid
        const tokenData = passwordResetTokens.get(token);
        if (!tokenData) {
            console.log('Token not found');
            return res.status(400).json({ 
                message: "Invalid or expired reset token", 
                success: false 
            });
        }
        
        // Rest of your function remains the same...
        // Check if token has expired
        if (Date.now() > tokenData.expires) {
            // Clean up expired token
            passwordResetTokens.delete(token);
            console.log('Token expired');
            return res.status(400).json({ 
                message: "Reset token has expired", 
                success: false 
            });
        }
        
        console.log('Token valid, finding user:', tokenData.userId);
        
        // Find user and update password
        const user = await User.findById(tokenData.userId);
        if (!user) {
            console.log('User not found with ID:', tokenData.userId);
            return res.status(400).json({ 
                message: "User not found", 
                success: false 
            });
        }
        
        console.log('User found:', user.email);
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        
        console.log('Updating password for user:', user.email);
        await user.save();
        
        // Remove used token
        passwordResetTokens.delete(token);
        console.log('Password reset successful, token removed');
        
        res.status(200).json({ 
            message: "Password has been reset successfully", 
            success: true 
        });
    } catch (err) {
        console.error('Reset password error:', err);
        console.error('Error details:', err.message);
        res.status(500).json({ 
            message: "Internal Server Error", 
            success: false 
        });
    }
};
module.exports = { 
    register, 
    login, 
    forgotPassword, 
    verifyResetToken, 
    resetPassword 
};