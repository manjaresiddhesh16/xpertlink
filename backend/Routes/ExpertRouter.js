const router = require('express').Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const UserModel = require('../Models/User');

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const experts = await UserModel.find({ role: 'expert' })
      .select('name skills bio pricePerSession rating');

    res.status(200).json(experts);
  } catch (err) {
    console.error('Get experts error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
