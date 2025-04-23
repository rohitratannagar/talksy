import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {

    const {fullName, email, password}  = req.body;
    try{
        if(!email || !password || !fullName){
            return res.status(400).json({message: "Please fill all the fields"});
        }

        if(password.length < 6){
            return res.status(400).json({message: "password must be atleast 6 characters"});
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "user with this email already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        });
        
        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            });
        }else{
            return res.status(400).json({message: "invalid user data"});
        }
    }catch(err){
        console.log("error in signup controller",err.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({message: "invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "invalid credentials"});
        }
        generateToken(user._id, res);
        return res.status(201).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("error in login controller",error.message);
        res.status(500).json({message: "Internal server error"});
    }
}
export const logout = (req, res) => {
    try {
        res.cookie('jwt', "", {maxAge: 1});
        res.status(200).json({message: "logged out successfully"});
    } catch (error) {
        console.log("error in logout controller",error.message);
        res.status(500).json({message: "Internal server error"});
    }
    
}

export const updateProfile = async (req,res) => {
    try {
        const {profilePic }= req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Profile pic is required"})
        }
        const uploadedImage = await cloudinary.uploader.upload(profilePic);
        console.log(uploadedImage);
        const updatedUser = await User.findOneAndUpdate({_id : req.user._id}, {
            $set: {
                profilePic: uploadedImage.url,
            }
        }, {new: true})
        // req.user = user
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update-Profile controller",error.message);
        res.status(500).json({message: "Internal server error"}); 
    }
}

export const checkAuth = (req,res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller",error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}