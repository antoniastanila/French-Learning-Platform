const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['student', 'admin'], default: 'student' },
        progress: { type: Object, default: {} },
        completedLessons: { type: [String], default: [] }
    },
    { timestamps: true }
);

// 🔹 Hash-uim parola înainte de a salva utilizatorul
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// 🔹 Metodă pentru a compara parola introdusă cu cea hash-uită
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// 🔹 Exportăm modelul
module.exports = mongoose.model('User', userSchema);
