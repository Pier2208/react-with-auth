require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require('./db/index.js')

const app = express();
connectDB();

// controllers
const AuthController = require('./controllers/auth.controller.js')
const UserController = require('./controllers/user.controller.js')

const whitelist = ['http://localhost:5173']
const corsOptions = {
    origin: function (origin, callback) {
        // if no origin: testing in postman
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/api/v1/auth', AuthController);
app.use('/api/v1/user', UserController);
app.use((err, req, res, next) => res.status(err.statusCode || 400).json({ message: err.message }))

const PORT = process.env.PORT || 8080;
mongoose.connection.once('open', () => {
    console.log('Connected to mongoDB')
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})

mongoose.connection.on('error', err => {
    console.log(err)
})

