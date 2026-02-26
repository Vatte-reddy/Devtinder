const express=require("express");

const userRouter=express.Router();

const {userAuth}=require("../middleWare/auth");
const ConnectionRequest=require("../models/ConnectionRequest");


userRouter.get("/user/requests",userAuth,async(req,res)=>{

    try{
          const loggedUser=req.user;    
          const connectionRequests=await ConnectionRequest.find({toUserId:loggedUser._id,status:"interested"}).populate("fromUserId",["firstName","lastName"]);
          res.status(200).json({message:"Success",data:connectionRequests});
    }
    catch(e)
    {
        res.status(500).json({message:"Internal Server Error"});
    }

})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    

try{

    const loggedUser=req.user;

    const connectionRequests=await ConnectionRequest.find({

        $or:[
            {fromUserId:loggedUser._id,status:"accepted"},
            {toUserId:loggedUser._id,status:"accepted"},
        ]
    }).populate("fromUserId toUserId",["firstName","lastName"]).populate("toUserId",["firstName","lastName"]);    

   const data=connectionRequests.map((row)=>{
    
    if(row.fromUserId._id.equals(loggedUser._id)){
        return row.toUserId;
    }   
    return row.fromUserId;
   })

    res.status(200).json({message:"Success",data});
}
catch(e)
{
        res.status(500).json({message:"Internal Server Error"});
}
});

userRouter.get("/user/feed",userAuth, async(req,res)=>{
    try{
        const loggedUser=req.user;
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 10; 
        

        const ConnectionRequest=await ConnectionRequest.find({


            $or: [

                {
                    fromUserId: loggedUser._id,
                },
                {
                    toUserId: loggedUser._id,
                }
            ]
        }).select("toUserId fromUserId")


        const hiddenUserfromFeed=new Set();

        ConnectionRequest.forEach((row)=>{

            hiddenUserfromFeed.add(row.toUserId.toString());
            hiddenUserfromFeed.add(row.fromUserId.toString());

        })



        const users=await User.find({
            $and: [
                {_id: { $nin: Array.from(hiddenUserfromFeed) }},
                {_id: { $ne: loggedUser._id }}
            ],

        }).select("firstName lastName email phoneNumber photoUrl about skills city").skip((page-1)*limit).limit(limit);

        res.status(200).json({message:"Success",data:users});

    }
    catch(e)
    {
        res.status(500).json({message:"Internal Server Error"});
    }
})
module.exports=userRouter; 