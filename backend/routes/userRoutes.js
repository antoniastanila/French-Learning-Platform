const express = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("555078852596-a4cmrg9dcrru8m3p714ct642o45lhi6o.apps.googleusercontent.com");

// 🔹 Înregistrare utilizator
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

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

        // 🔹 Adăugăm un nivel implicit pentru utilizator
        const newUser = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            level: 'beginner'
          });
        await newUser.save();

        // 🔹 Generăm un token JWT automat după înregistrare
        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 🔹 Returnăm utilizatorul și token-ul pentru autentificare automată
        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: {
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                email: newUser.email,
                level: newUser.level, // 🔹 Ne asigurăm că trimitem și nivelul utilizatorului
                createdAt: newUser.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

router.patch('/:userId/update-level', async (req, res) => {
    try {
        const { userId } = req.params;
        const { level } = req.body;

        if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
            return res.status(400).json({ message: 'Nivel invalid.' });
        }

        const user = await User.findByIdAndUpdate(userId, { level }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });
        }

        res.json({ message: 'Nivel actualizat cu succes.', user });
    } catch (error) {
        console.error('❌ Eroare la actualizarea nivelului:', error);
        res.status(500).json({ message: 'Eroare de server.', error });
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

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("🔍 User data sent in login response:", user);

        res.json({ 
            message: 'Login successful', 
            token,
            user: { 
                _id: user._id, 
                username: user.username, 
                email: user.email,
                level: user.level,  
                completedLessons: user.completedLessons,
                profilePicUrl: user.profilePicUrl,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt 
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
        const { lessonId, level } = req.body; // 🔹 Prinde și nivelul
        const user = await User.findById(req.params.userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // ✅ Inițializează progresul pentru nivelul respectiv dacă nu există
        if (!user.progress[level]) {
            user.progress[level] = [];
        }

        // ✅ Evităm duplicarea lecțiilor deja completate
        if (!user.progress[level].includes(lessonId)) {
            user.progress[level] = [...new Set([...user.progress[level], lessonId])];
            await user.save();
        }

        console.log(`✅ Lecție ${lessonId} marcată ca finalizată pentru nivelul ${level}`);

        res.status(200).json({ message: 'Lesson marked as completed', completedLessons: user.progress[level] });
    } catch (error) {
        console.error("❌ Eroare la actualizarea progresului:", error);
        res.status(500).json({ message: 'Error updating progress', error });
    }
});


router.post('/:userId/complete-multiple-lessons', async (req, res) => {
    const { userId } = req.params;
    const { lessonIds } = req.body;
  
    console.log("✅ USER:", userId);
    console.log("✅ Lecții primite:", lessonIds);
    console.log("✅ Tip lessonIds:", typeof lessonIds, " | Este array?", Array.isArray(lessonIds));
  
    if (!lessonIds || !Array.isArray(lessonIds)) {
      return res.status(400).json({ message: "Invalid lesson IDs" });
    }
  
    try {
      const update = {
        $addToSet: { completedLessons: { $each: lessonIds } }
      };
  
      const result = await User.updateOne({ _id: userId }, update);
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const updatedUser = await User.findById(userId);
      res.json({ message: "Lessons marked as completed", completedLessons: updatedUser.completedLessons });
    } catch (error) {
      console.error("❌ Error marking lessons as completed:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  router.post('/google-login', async (req, res) => {
    try {
      const { idToken } = req.body;
      console.log("📥 ID Token primit:", idToken); 
      const ticket = await client.verifyIdToken({
        idToken,
        audience: "555078852596-a4cmrg9dcrru8m3p714ct642o45lhi6o.apps.googleusercontent.com",
      });
  
      const payload = ticket.getPayload();
      console.log("✅ Payload primit:", payload);
      const { email, name, sub } = payload;
  
      let user = await User.findOne({ email });
  
      if (!user) {
        user = new User({
          username: name,
          email,
          password: '', // goale pt conturi Google
          googleId: sub,
          level: 'beginner',
          firstName: payload.given_name || '',
          lastName: payload.family_name || ''
        });
        await user.save();
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      res.json({
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          level: user.level,
          profilePicUrl: user.profilePicUrl || '',
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt
        }
      });
    } catch (err) {
      console.error("❌ Google login error:", err);
      res.status(401).json({ message: "Google authentication failed" });
    }
  });

  router.get('/check-username/:username', async (req, res) => {
    const { username } = req.params;
    const exists = await User.findOne({ username });
    res.json({ exists: !!exists });
  });

  router.patch('/:userId/upload-profile-pic', upload.single('image'), async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
      }
  
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.profilePicUrl = base64Image;
      await user.save(); // 🔥 garantăm salvarea reală
  
      res.json({ message: 'Profile picture updated', imageUrl: base64Image });
    } catch (err) {
      console.error('❌ Upload error:', err);
      res.status(500).json({ message: 'Server error during upload', error: err.message });
    }
  });
  
  router.patch('/:userId/update-profile', async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, profilePic, username } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // 🔐 Verificăm dacă username-ul se schimbă
      if (username && username !== user.username) {
        const exists = await User.findOne({ username });
        if (exists && exists._id.toString() !== userId) {
          return res.status(400).json({ message: 'Username is already taken' });
        }
        user.username = username; // ✅ Trebuie setat aici!
      }
  
      user.firstName = firstName;
      user.lastName = lastName;
      user.profilePicUrl = profilePic;
  
      await user.save(); // 🔁 SALVEAZĂ TOATE MODIFICĂRILE O DATĂ
  
      res.json({ message: 'Profile updated', user });
    } catch (err) {
      console.error('❌ Eroare la actualizare profil:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  

module.exports = router;
