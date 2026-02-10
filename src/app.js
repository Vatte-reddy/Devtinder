const express = require('express');

const app = express();

app.use("/test", (req, res) => {
    res.send("Namaste are you doing good");
});

app.use("/hello", (req, res) => {
    res.send("Hello this is practise");
});

app.use("/", (req, res) => {
    res.send("Namaste NODEJS");
});

app.listen(3000, () => {
    console.log("Server is running at port 3000");
});
