const express = require('express');

const connectDb = require('./config/db');
const User = require('./models/User');

const bcrypt = require('bcrypt');

// const validator = require('validator');
const { validationSignup } = require('./utilis/Validation');

const app = express();

app.use(express.json()); // Parse JSON body

app.post("/signup", async (req, res) => {
    
    
    try {
        const {firstName,lastName,email,password}=new User(req.body);

        validationSignup(req);
       
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
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
          throw new Error("Invalid credentials");
        }   
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error(error);
       res.status(400).json("Error:" + error.message );
    }
});

app.get("/users", async (req, res) => {
    const emailid=req.body.email;
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




