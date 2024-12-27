import  {Schema ,model} from "mongoose"
import bcrypt from "bcrypt"
const UserShema= Schema({
       fullName:{
            type:String,
            require:true,
            unique:true,

       },
       email:{
         type:String,
         unique:true,
         require:true,
       },
       password:{
          type:String,
          require:true,
          minlength:0,
       },
      
       profilePic:{
                type:String,
                default:""
       },
    
       createdAt:{
        type:Date,
        default:Date.now
       }

} ,{timestams:true})
// hasihng password;



const User=  new model('User',UserShema);
export default User