import cloudinary from "../db/cloudinary.js"
import { generateToken } from "../db/utils.js"
import User from "../model/user.model.js"
import bcrypt from "bcryptjs"
export const signup = async(req,res)=>{
        try {
            const {password,fullName, email}= req.body
            // hash password
                if(password.length<6)
                {
                       return res.status(400).send({message:"Password  must be at leat 6 charcters"})
                }
                if(!fullName || !email)
                {
                    return res.status(400).send({message:"all fileds are compulsory"})
                }
                const user= await User.findOne({email})
                     if(user)
                     {
                          return res.status(400).send({message:"Email already exist"})
                     }
                     const salt= await bcrypt.genSalt(10);
                     const hashedPassword= await bcrypt.hash(password,salt);
                     const newUser=  new User({
                            fullName,
                            email,
                            password:hashedPassword
                     })
                     if(newUser)
                     {         const token=  generateToken(newUser._id ,res);
                        await newUser.save();
                            return res.status(200).json( {
                                  _id:newUser._id,
                                  fullName:newUser.fullName,
                                  email:newUser.email,
                                  profilePic:newUser.profilePic,
                                  token

                          })
                     }
                     else{
                            res.status(400). json({message:"Invalid user data"});
                     }


        } catch (error) {
            
        }
}
export const login = async (req,res)=>{
       const {email ,password}= req.body;
       try {
             const user=  await User.findOne({email});
             if(!user)
             {
                   return res.status(400).json({message:"User do not exist"})
             }
             const isPassword=  await bcrypt.compare(password, user.password);
             if(!isPassword)
             { 
                return res.status(400).json({message:"Password Incorrecr"})
             }
             const token = generateToken(user._id,res);
             res.status(200).json({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic,
                token
             })


       } catch (error) {
                 return res.status(500).json({message:"Internal Server Error"})
       }
}
export const logout= (req,res)=>{
        try {
              res.cookie("jwt" ,"", {maxAge:0})
              return res.status(200).json({message:"Logout Successfully"})
        } catch (error ) {
            return res.status(500).json({message:"Internal Server Error"})
        }
}
export const updateProfile= async(req,res)=>{
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        if (!uploadResponse.secure_url) {
            return res.status(400).json({ message: "Cloudinary upload failed" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        if (!updatedUser) {
            return res.status(400).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error updating profile:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    
}
export const checkAuth= async(req,res)=>{
    
    try {
         console.log("JWT in cookies:", req.cookies.jwt);
         return res.status(200).json(req.user);


    }
    catch (error) {
       return res.status(500).json({message:"Internal Server Error"})
    }
}