const express = require('express');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db');
const cors = require('cors');



const app = express();

app.use(cors({
    origin: ['http://3.26.45.216', 'http://localhost:5173'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Custom fallback for preflight to ensure browsers NEVER block PATCH
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(cookieParser());
app.use(express.json());

const User = require('./models/User');

const authRouters = require('./routers/authRouters');
const profileRouters = require('./routers/Profile');
const requestsRouter = require('./routers/requests');
const userRouter = require('./routers/userRouter');

app.use('/', authRouters);
app.use('/', profileRouters);
app.use('/', requestsRouter);
app.use('/', userRouter);












connectDb().then(() => {

    console.log("connected to database");
    app.listen(1818, () => {
        console.log("Server is running at port 1818");
    });

})
    .catch((err) => {
        console.log("connection error", err);
    })




