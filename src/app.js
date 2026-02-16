const express = require('express');

const connectDb = require('./config/db');

const app = express();

app.use(express.json()); // Parse JSON body

app.post("/signup", async (req, res) => {
    try {
        const { username, lastname, email, password, age, gender, phone, address, city, state, pincode } = req.body;        
        const user = new User({ username, lastname, email, password, age, gender, phone, address, city, state, pincode });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
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




