const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['learner', 'expert'],
    default: 'learner'
  },
  // 🔽 extra fields mainly for experts
  skills: {
    type: [String],       // e.g. ["react", "hooks", "javascript"]
    default: []
  },
  bio: {
    type: String
  },
  pricePerSession: {
    type: Number,
    default: 400
  },
  rating: {
    type: Number,
    default: 5.0
  }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
