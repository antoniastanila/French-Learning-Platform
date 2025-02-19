const express = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 🔹 Înregistrare utilizator
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Verificăm dacă username sau email sunt deja folosite
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username is already taken!' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email is already in use!' });
        }

        // Creăm noul utilizator
        const newUser = new User({ username, email, password });
        await newUser.save();

        // 🔹 Generăm un token JWT automat după înregistrare
        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, 'your_jwt_secret', { expiresIn: '1h' });

        // 🔹 Returnăm utilizatorul și token-ul pentru autentificare automată
        res.status(201).json({ message: 'User registered successfully!', token, user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});


// 🔹 Autentificare utilizator
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 🔹 Generăm un token JWT și îl trimitem utilizatorului
        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', details: error.message });
    }
});

module.exports = router;
