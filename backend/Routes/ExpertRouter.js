const router = require('express').Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const Expert = require('../Models/Expert');

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const experts = await Expert.find({});
    res.status(200).json(experts);
  } catch (err) {
    console.error('Get experts error:', err);
    res.status(500).json({ message: 'Failed to fetch experts' });
  }
});

module.exports = router;
