const express = require('express');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db');

const app = express();

app.use(cookieParser());
app.use(express.json()); // MUST be before routes

const User = require('./models/User');

const authRouters = require('./routers/authRouters');
const profileRouters = require('./routers/Profile');
const requestsRouter = require('./routers/requests');
const userRouter = require('./routers/userRouter');

app.use('/auth', authRouters);
app.use('/profile', profileRouters);
app.use('/requests', requestsRouter);
app.use('/users', userRouter);





// Debug middleware: log incoming cookies and auth headers to help visibility
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} cookies=${JSON.stringify(req.cookies || {})} authHeader=${req.headers.authorization || ''}`);
    next();
});

app.get("/users", async (req, res) => {
    const emailid = req.query.email;

    const users=await User.find({email:emailid});
    console.log(emailid);
    if(users.length>0){
        res.status(200).json(users);
    } else {
        res.status(404).json({ message: "User not found" });
    }   
});




connectDb().then(()=>{

    console.log("connected to database");
    app.listen(1818, () => {
    console.log("Server is running at port 1818");
});

})
.catch((err)=>{
    console.log("connection error",err);
})




