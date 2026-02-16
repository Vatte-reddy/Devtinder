const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
    },
    lastname:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    age:{
        type:Number,
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
    

})

const User=mongoose.model('User',userSchema);

module.exports=User;