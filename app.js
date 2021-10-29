require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middelware/auth')
const app = express();
app.use(express.json());

app.get("/",(req, res, next) => {
    User.find((error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    })
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            //create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )
            
            user.token = token;
            return(
                res.status(201).json(user)
            );
        }
        res.status(400).send("Invalid Credentials");

    } catch (error) {
        console.log(error);
    }
})






app.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!(first_name && last_name && email && password)) {
            res.status(400).send("All input is required")
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).send("Email already exist. Please login")
        }

        encrytedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encrytedPassword
        })

        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h"
            }

        )

        user.token = token;

        res.status(201).json(user);

    } catch (error) {
        console.log(error);
    }
})

app.post('/welcome',auth,(req,res)=>{
    res.status(200).send('Welcome To home page');
})

module.exports = app;


