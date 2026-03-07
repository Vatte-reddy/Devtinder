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
        required:true,
        enum:["pending","ignore","interested","accepted","rejected"],
        message: `{VALUE} is incorrect status type`,
    },  
   
},
{ 
    timestamps:true,

})

// connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

ConnectionRequest.pre('save', function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
      throw new Error("You cannot send connection request to yourself");
    }
});

module.exports=mongoose.model("ConnectionRequest",ConnectionRequest)