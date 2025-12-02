require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./Models/Expert');

const mongo_url = process.env.MONGO_CONN;

// Sample expert dataset
const expertData = [
  { name: 'Anil Kumar', skill: 'React', experience: 3, rating: 4.8, price: 350, language: 'English' },
  { name: 'Neha Sharma', skill: 'Python', experience: 2, rating: 4.6, price: 300, language: 'Hindi' },
  { name: 'Rahul Deshmukh', skill: 'JavaScript', experience: 4, rating: 4.7, price: 400, language: 'English' },
  { name: 'Sana Patel', skill: 'Java', experience: 5, rating: 4.9, price: 450, language: 'Hindi' },
  { name: 'Maria Gomez', skill: 'UI/UX Design', experience: 3, rating: 4.5, price: 375, language: 'English' },
  { name: 'Kunal Singh', skill: 'Node.js', experience: 4, rating: 4.8, price: 425, language: 'English' },
  { name: 'Ayesha Khan', skill: 'DSA', experience: 2, rating: 4.6, price: 320, language: 'Hindi' },
  { name: 'Vikram Joshi', skill: 'MongoDB', experience: 3, rating: 4.7, price: 330, language: 'English' },
  { name: 'Harsh Raj', skill: 'Cloud Deployment', experience: 4, rating: 4.8, price: 500, language: 'English' },
  { name: 'Sophie Turner', skill: 'Cyber Security', experience: 3, rating: 4.6, price: 470, language: 'English' },
  { name: 'Ali Shaikh', skill: 'Flutter', experience: 2, rating: 4.5, price: 310, language: 'Hindi' },
  { name: 'Ritika Jain', skill: 'Video Editing', experience: 3, rating: 4.7, price: 340, language: 'English' }
];

async function seed() {
  try {
    await mongoose.connect(mongo_url);
    console.log('Connected to MongoDB');

    await Expert.deleteMany({});
    console.log('Old experts removed');

    const inserted = await Expert.insertMany(expertData);
    console.log(`Inserted ${inserted.length} experts`);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
    process.exit();
  }
}

seed();
