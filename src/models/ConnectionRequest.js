const mongoose=require("mongoose");

const ConnectionRequest=new mongoose.Schema({
    
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:["pending","ignore","interested","accepted","rejected"],
        default:"pending",
    },  
   
},
{ 
    timestamps:true,

})

ConnectionRequest.pre('save', function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
      throw new Error("You cannot send connection request to yourself");
    }
});

module.exports=mongoose.model("ConnectionRequest",ConnectionRequest)