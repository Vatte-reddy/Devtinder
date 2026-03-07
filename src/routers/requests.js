const express = require('express');
const { userAuth } = require('../middleWare/auth');
const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/User');


const requestsRouter = express.Router()


requestsRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
   try {


      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;

      const status = req.params.status;

      const allowedStatuses = ["ignore", "interested"];

      if (!allowedStatuses.includes(status)) {
         return res.status(400).json({ message: "Invalid status value" });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
         return res.status(404).json({ message: "To user not found" });
      }

      const existingRequest = await ConnectionRequest.findOne({


         $or: [

            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
         ],


      });

      if (existingRequest) {
         return res.status(400).json({ message: "Connection request already exists" });
      }

      const connectionRequest = new ConnectionRequest({
         fromUserId,
         toUserId,
         status,
      })

      const data = await connectionRequest.save();

      return res.json({ message: `${req.user.firstName} is ${status} in ${toUser.firstName}`, data });
   }
   catch (e) {
      return res.status(400).json({ message: "ERROR", error: e.message })
   }
});

requestsRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
   try {
      const loggedInUser = req.user;
      const allowedStatuses = ["accepted", "rejected"];

      const { status, requestId } = req.params;
      const connectionRequest = await ConnectionRequest.findById({
         _id: requestId,
         toUserId: loggedInUser._id,

         status: "interested",
      });

      if (!connectionRequest) {
         return res.status(404).json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: `You have ${status} the connection request from ${loggedInUser.firstName}`, data });

      if (!allowedStatuses.includes(status)) {
         return res.status(400).json({ message: "Invalid status value" });
      }
   }
   catch (e) {
      res.status(400).json({ message: "ERROR", error: e.message })
   }
})
module.exports = requestsRouter