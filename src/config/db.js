const mongoose=require('mongoose');


const connectDb=async()=>{

    const promises=await mongoose.connect('mongodb+srv://vatteprudhvidharreddy18:Prudhvidhar%4017@cluster0.ad0zdfw.mongodb.net/devtinder');
   



}

module.exports=connectDb;
