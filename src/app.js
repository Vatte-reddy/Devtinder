const express = require('express');
var cookieParser = require('cookie-parser')
const jwt=require('jsonwebtoken');
const connectDb = require('./config/db');
const User = require('./models/User');
const { userAuth } = require('./middleWare/auth');
const bcrypt = require('bcrypt');

// const validator = require('validator');
const { validationSignup } = require('./utilis/Validation');

const app = express();
app.use(cookieParser());

app.use(express.json()); // Parse JSON body

// Debug middleware: log incoming cookies and auth headers to help visibility
app.use((req, res, next) => {
  
    next();
});

app.post("/signup", async (req, res) => {
    
    
    try {
       const { firstName, lastName, email, password } = req.body;
validationSignup(req.body);



       
       
        const hashedPassword=await bcrypt.hash(password,10);
        console.log("hashed password",hashedPassword);
        const user=new User({
            firstName,
            lastName,
            email,
            password:hashedPassword
        });
       
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "Error saving user data" });
    }
});

app.post("/login", async (req, res) => {
    const {email,password}=req.body;        
    try {
        const user=await User.findOne({email:email});
        if(!user){
            throw new Error("Invalid credentials");
        }   
                // DEBUG: show incoming password and stored hash (remove in production)
                console.log('login attempt - req.body.password:', password);
                console.log('login attempt - stored user.password (hash or plain):', user.password);

                // Support legacy accounts where password may have been stored in plaintext.
                // If stored password looks like a bcrypt hash, use bcrypt.compare.
                // Otherwise compare plaintext and, on success, upgrade stored password to a bcrypt hash.
                let isPasswordMatch = false;
                const stored = user.password || '';
                const isBcryptHash = /^\$2[aby]\$/.test(stored);
                if (isBcryptHash) {
                    isPasswordMatch = await bcrypt.compare(password, stored);
                    console.log('bcrypt.compare result:', isPasswordMatch);
                } else {
                    // stored is not hashed — compare directly
                    isPasswordMatch = password === stored;
                    console.log('plaintext comparison result:', isPasswordMatch);
                    if (isPasswordMatch) {
                        // Upgrade password storage to bcrypt hash
                        try {
                            const newHash = await bcrypt.hash(password, 10);
                            user.password = newHash;
                            await user.save();
                            console.log('Upgraded plaintext password to hashed for user', user.email);
                        } catch (e) {
                            console.error('Failed to upgrade password hash:', e.message);
                        }
                    }
                }

                if(!isPasswordMatch){
                  throw new Error("password Invalid credentials");
                }
        else {
            const token=jwt.sign({userId:user._id},'DevTinder@17');
            console.log("token",token)
            // set cookie with sensible defaults and return token in body for debugging
            res.cookie("token", token, { httpOnly: true, sameSite: 'lax' });
            res.status(200).json({ message: "Login successful", token });
        }
    } catch (error) {
        console.error(error);
       res.status(400).json("Error:" + error.message );
    }
});

app.get("/profile", userAuth,async (req, res) => {


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


app.get("/sentConnectionRequests", userAuth, async (req, res) => {
   const user=req.user;
   console.log("sending connection requests from user");

   res.send(user.firstName+ "send connection request first")
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




