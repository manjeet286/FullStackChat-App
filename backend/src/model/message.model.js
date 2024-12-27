import  {Schema ,model ,mongoose} from "mongoose"
import bcrypt from "bcrypt"
const messageSchema= Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
      },
      image: {
        type: String,
      },

} ,{timestams:true})




const Message=  new model('Message',messageSchema);
export default Message