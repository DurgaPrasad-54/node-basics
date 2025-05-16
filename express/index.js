const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usermodel = require('./Models/usermodel');

mongoose.connect('mongodb://localhost:27017/nutrify').then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{   
    console.log("Error connecting to MongoDB", err);
});
const app = express();  
app.use(express.json());

app.post('/register', (req, res) =>{
    let user=req.body;
    // Hash the password
    const saltRounds = 10;
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).send({message: "Error hashing password"});
        }
        else{
            user.password = hash;
            Usermodel.create(user).then(()=>{
            res.status(200).send({message: "User registered successfully"});
            }).catch((err)=>{
            console.log(err);
            res.status(500).send({message: "Error registering user"});
    });
   }
    });
   

});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Usermodel.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (!password || !user.password) {
            return res.status(400).send({ message: "Missing password or hash" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({ message: "Invalid password" });
        }

        jwt.sign({ email: user.email }, "prasad", { expiresIn: '1m' }, (err, token) => {
            if (err) {
                return res.status(500).send({ message: "Token generation failed" });
            }

            res.status(200).send({ message: "Login successful", token });
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send({ message: "Internal server error" });
    }
});





app.listen(8800, () => {    
    console.log("Server started on port 3000");
});