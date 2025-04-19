import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    progress: { type: Object, default: {} },
    completedLessons: { type: [String], default: [] },
    profilePicUrl: { type: String, default: '' }
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
const User = mongoose.model('User', userSchema);
export default User;
