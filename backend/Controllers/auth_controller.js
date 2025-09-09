const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const register = async (req, res) => {
    try{
        const { name,email, password } = req.body;
        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ message: "User already exists, Login now", sucess: false });
        }
        const newUser = new User({name, email, password });
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", success: true });
    }catch(err){
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


const login = async (req, res) => {
    try{
        const { name,email, password } = req.body;
        const user = await User.findOne({ email });
        const erromsg = "Invalid email or password";
        if(!user){
            return res.status(403).json({ message: erromsg, sucess: false });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(403).json({ message: erromsg, sucess: false });
        }
        const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
             message: "Logged in successfully", 
             success: true,
             jwtToken,
             email,
             name: user.name 
            });
    }catch(err){
        res.status(500).json({ 
            message: "Internal Server Error", 
            success: false 
        });
    }
}

module.exports = { register, login};