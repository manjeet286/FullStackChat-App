import cloudinary from "../db/cloudinary.js";
import { getReceiverSocketId ,io } from "../db/soket.js";
import Message from "../model/message.model.js";
import User from "../model/user.model.js";

export const getUserForSideBar =async(req,res)=>{
       try {
            const loggedInUser= req.user._id;
             const filteredUser= await User.find({_id:{$ne:loggedInUser}})
             res.status(200).json(filteredUser)

       } catch (error ) {
        return res.status(500).json({ error: "Internal Server Error" });
       }
}
export const getMessage =async(req,res)=>{
    try {
           const {id:userToChatId} = req.params;
           const myId= req.user._id;
           const message= await Message.find({
            $or:[
                 {senderId:myId, receiverId:userToChatId},
                 {
                      senderId:userToChatId , receiverId:myId
                 }
            ]
           })
           return res.status(200).json(message)


    } catch (error ) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export const sendMessage =async(req,res)=>{
    try {
          const {text, image}= req.body;
          const {id:receiverId}= req.params;
          const senderId= req.user._id;
          let imageUrl;
          if(image)
          {
              const uploadResponse= await cloudinary.uploader.upload(image)
              imageUrl =uploadResponse.secure_url;
          }
                   const newMessage= new Message({
                     senderId,receiverId
                     ,text,
                     image:imageUrl
                   })
                   await newMessage.save();
                    const receiverSocketId= getReceiverSocketId(receiverId);
                    if(receiverSocketId)
                    {
                        io.to(receiverSocketId).emit("newMessage" ,newMessage)
                    }
                    else {
                        console.error("Receiver socket ID not found for:", receiverId);
                    }
                   res.status(200) .json(newMessage);

    } catch (error ) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}