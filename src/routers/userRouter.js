const express = require("express");

const userRouter = express.Router();

const { userAuth } = require("../middleWare/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");



userRouter.get("/user/requests", userAuth, async (req, res) => {

    try {
        const loggedUser = req.user;
        const connectionRequests = await ConnectionRequest.find({ toUserId: loggedUser._id, status: "interested" }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "skills", "photoUrl", "about", "city"]);
        res.status(200).json({ message: "Success", data: connectionRequests });
    }
    catch (e) {
        res.status(500).json({ message: "Internal Server Error" });
    }

})

userRouter.get("/user/connections", userAuth, async (req, res) => {


    try {

        const loggedUser = req.user;

        const connectionRequests = await ConnectionRequest.find({

            $or: [
                { fromUserId: loggedUser._id, status: "accepted" },
                { toUserId: loggedUser._id, status: "accepted" },
            ]
        }).populate("fromUserId", "firstName lastName age gender skills photoUrl about city").populate("toUserId", "firstName lastName age gender skills photoUrl about city");

        const data = connectionRequests.map((row) => {
            if (!row.fromUserId || !row.toUserId) return null;

            if (row.fromUserId._id.toString() === loggedUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        }).filter(user => user !== null);

        res.status(200).json({ message: "Success", data });
    }
    catch (e) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {

    try {

        const loggedUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({


            $or: [

                {
                    fromUserId: loggedUser._id,
                },
                {
                    toUserId: loggedUser._id,
                }
            ]
        }).select("toUserId fromUserId")


        const hiddenUserfromFeed = new Set();

        connectionRequests.forEach((row) => {
            hiddenUserfromFeed.add(row.toUserId.toString());
            hiddenUserfromFeed.add(row.fromUserId.toString());
        });



        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hiddenUserfromFeed) } },
                { _id: { $ne: loggedUser._id } }
            ],

        }).select("firstName lastName email phoneNumber photoUrl about skills city").skip(skip).limit(limit);

        res.status(200).json({ message: "Success", data: users });

    }
    catch (e) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})
module.exports = userRouter; 