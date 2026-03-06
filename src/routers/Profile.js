const express = require('express');

const profileRouters=express.Router();
const { userAuth } = require('../middleWare/auth');
const { validateProfileEdit } = require('../utilis/Validation');
const ConnectionRequest = require('../models/ConnectionRequest');
const { validate } = require('../models/User');



profileRouters.get("/profile/view", userAuth,async (req, res) => {


    // try to verify token if present
    try{
        const user=req.user;
        if(!user)
        {
            throw new Error("Unauthorized");
        }
      res.send(user)
    }
    catch(e)
    {
        console.error(e);
        res.status(401).json({ message: "Unauthorized" });
    }
});

profileRouters.patch("/profile/edit", userAuth, async (req, res) => {


    try{
        if(!validateProfileEdit(req))
        {
            throw new Error("Invalid profile data");
        }
    }
    catch(e)
    {
        console.error(e);
        return res.status(400).json({ message: e.message });
    }
});

  


module.exports=profileRouters
