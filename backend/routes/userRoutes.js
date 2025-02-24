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
            return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Parola este incorectă.' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ 
            message: 'Login successful', 
            token,
            user: { 
                _id: user._id, 
                username: user.username, 
                completedLessons: user.completedLessons 
            } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la autentificare', details: error.message });
    }
});

router.get('/:userId/progress', async (req, res) => {
    console.log("🔍 Request pentru progresul utilizatorului:", req.params.userId);

    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            console.log("❌ Utilizatorul nu a fost găsit!");
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("✅ Lecții completate:", user.completedLessons);
        res.json({ completedLessons: user.completedLessons });
    } catch (error) {
        console.error("❌ Eroare la obținerea progresului:", error);
        res.status(500).json({ message: 'Error getting progress', error: error.message });
    }
});
router.post('/:userId/complete-lesson', async (req, res) => {
    try {
        const { lessonId } = req.body;
        const user = await User.findById(req.params.userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.completedLessons.includes(lessonId)) {
            user.completedLessons.push(lessonId); 
            await user.save();
        }

        res.status(200).json({ message: 'Lesson marked as completed' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error });
    }
});

module.exports = router;
