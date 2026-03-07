const express = require('express');

const profileRouters=express.Router();
const { userAuth } = require('../middleWare/auth');
const { validateProfileEdit } = require('../utilis/Validation');






// profileRouters.get("/view", userAuth,async (req, res) => {


//     // try to verify token if present
//     try{
//         const user=req.user;
//         if(!user)
//         {
//             throw new Error("Unauthorized");
//         }
        
//       res.send(user)
//     }
//     catch(e)
//     {
//         console.error(e);
//         res.status(401).json({ message: "Unauthorized" });
//     }
// });

// Support requests that include the router base twice (client bug):
// GET /profile/profile/view -> treat as /profile/view
profileRouters.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
       
        res.send(user);
    } catch (e) {
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

        const loggedUser=req.user;

        Object.keys(req.body).forEach((key)=>{
            loggedUser[key]=req.body[key];
        })
        await loggedUser.save();
        res.json({
      message: `${loggedUser.firstName}, your profile updated successfuly`,
      data: loggedUser,
    });
    }
    catch(e)
    {
        console.error(e);
        return res.status(400).json({ message: e.message });
    }
});

  


module.exports=profileRouters