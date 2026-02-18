const mongoose = require('mongoose');
const validator=require('validator');

const userSchema=new mongoose.Schema({
    firstName:{

        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        trim:true,
        required:true,
         unique:true,
         lowercase:true,

         validate(value){

           if(!validator.isEmail(value)){
            throw new Error("Invalid email address");
           } 
           
        }   
    },
    password:{
        type:String,
        required:true,
         minlength:6,
        

    },
    age:{
        type:Number,
        min:18,
    }, 
    gender:{
        type:String,
    },
    phone:{
        type:Number,
    },
    address:{
        type:String,
    },
    city:{
        type:String,
    },
    state:{
        type:String,
    },
    pincode:{
        type:Number,
    },
    

},
{
    timestamps:true,
})

const User=mongoose.model('User',userSchema);

module.exports=User;