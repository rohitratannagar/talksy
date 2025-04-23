import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUsersForSideBar = async (req,res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers= await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("error in getUsersForSideBar controller",error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getMessages = async (req,res) => {
    try {
        const myId = req.user._id;
        const chatId = req.params.id;

        const messages = await Message.find({
            $or:[
                {
                    senderId: myId, receiverId: chatId,
                },{
                    senderId: chatId, receiverId: myId
                }
            ]
        });
        
        return res.status(200).json(messages);
    } catch (error) {
        console.log("error in getMessages controller",error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.id;
        const {text, image} = req.body;

        let imageUrl;

        if(image){
            const uploadedData = await cloudinary.uploader.upload(image);
            imageUrl = uploadedData.secure_url;
        }
        const message = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await message.save();
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", message);
        }
        return res.status(201).json(message);
    } catch (error) {
        console.log("error in sendMessages controller",error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const  deleteMessage = async (req,res) => {
    try {
        const id = req.params.id;
        const result = await Message.findByIdAndDelete(id);
        if(!result) return res.status(400).json({message: "error in deleting message"});
        
        const receiverId = result.receiverId
        const receiverSocketId = getReceiverSocketId(receiverId);

        if(receiverSocketId){
            io.to(receiverSocketId).emit("deleteMessage", result);
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
    
}