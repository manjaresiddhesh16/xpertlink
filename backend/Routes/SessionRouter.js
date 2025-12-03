const router = require('express').Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const SessionModel = require('../Models/Session');
const UserModel = require('../Models/User');

// POST /sessions  -> learner creates a session request
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { expertId, topic, doubtText, scheduledFor } = req.body;
    const learnerId = req.user._id; // from JWT

    if (!expertId || !topic || !doubtText) {
      return res.status(400).json({
        success: false,
        message: 'expertId, topic and doubtText are required'
      });
    }

    // Optional: check that expertId is actually an expert
    const expert = await UserModel.findById(expertId);
    if (!expert || expert.role !== 'expert') {
      return res.status(400).json({
        success: false,
        message: 'Provided expertId is not a valid expert'
      });
    }

    const session = new SessionModel({
      learnerId,
      expertId,
      topic,
      doubtText,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      price: expert.price || undefined // only if you add price on user later
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Session request created',
      session
    });
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /sessions/mine  -> both learner & expert view their related sessions
router.get('/mine', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role; // learner/expert

    let filter = {};
    if (role === 'expert') {
      filter.expertId = userId;
    } else {
      filter.learnerId = userId;
    }

    const sessions = await SessionModel.find(filter)
      .sort({ createdAt: -1 })
      .populate('learnerId', 'name email')
      .populate('expertId', 'name email');

    res.status(200).json({
      success: true,
      sessions
    });
  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PATCH /sessions/:id/accept  -> expert accepts a session
router.patch('/:id/accept', ensureAuthenticated, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;
    const role = req.user.role;

    if (role !== 'expert') {
      return res.status(403).json({
        success: false,
        message: 'Only experts can accept sessions'
      });
    }

    const session = await SessionModel.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (String(session.expertId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: 'You are not the expert for this session'
      });
    }

    session.status = 'accepted';
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Session accepted',
      session
    });
  } catch (err) {
    console.error('Accept session error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
