const mongoose = require('mongoose');

const ExpertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skill: { type: String, required: true },
  experience: { type: Number, required: true }, // years
  rating: { type: Number, default: 5 },
  price: { type: Number, required: true }, // cost per session
  language: { type: String, default: 'English' }
});

const ExpertModel = mongoose.model('Expert', ExpertSchema); // collection: experts
module.exports = ExpertModel;
