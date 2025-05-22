const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usermodel = require('./Models/usermodel');
const verifytoken = require('./middleware/verify');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nutrify')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await Usermodel.create({ name, email, password: hash });

    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send({ message: "Registration failed", error: err.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usermodel.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send({ message: "Password not matched" });
    }

    const token = jwt.sign({ id: user.email }, "prasad", { expiresIn: "1h" });

    res.status(200).send({ message: "Login success", token });
  } catch (err) {
    res.status(500).send({ message: "Login failed", error: err.message });
  }
});

app.get("/dashbord",verifytoken,(req,res)=>{
    res.send({message:"Welcome to the dashboard"})
})




app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
