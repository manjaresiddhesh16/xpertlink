// const router = require('express').Router();
// const ensureAuthenticated = require('../Middlewares/Auth');
// const SessionModel = require('../Models/Session');
// const UserModel = require('../Models/User');

// // POST /sessions  -> learner creates request for expert
// router.post('/', ensureAuthenticated, async (req, res) => {
//   try {
//     const user = req.user;                 // filled by Auth middleware
//     const learnerId = user._id;
//     const { expertId, topic, doubtText, price } = req.body;

//     if (!expertId || !topic) {
//       return res.status(400).json({
//         success: false,
//         message: 'expertId and topic are required',
//       });
//     }

//     // optional: verify that expertId is actually an expert
//     const expert = await UserModel.findById(expertId);
//     if (!expert || expert.role !== 'expert') {
//       return res.status(400).json({
//         success: false,
//         message: 'Selected expert does not exist or is not an expert',
//       });
//     }

//     const session = new SessionModel({
//       learnerId,
//       expertId,
//       topic,
//       doubtText,
//       price: price || expert.pricePerSession || 400,
//     });

//     await session.save();

//     return res.status(201).json({
//       success: true,
//       message: 'Session request created',
//       session,
//     });
//   } catch (err) {
//     console.error('Create session error:', err);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// });

// // GET /sessions/mine  -> for learner: their requests; for expert: incoming requests
// router.get('/mine', ensureAuthenticated, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const role = req.user.role;

//     const filter = role === 'expert'
//       ? { expertId: userId }
//       : { learnerId: userId };

//     const sessions = await SessionModel.find(filter)
//       .sort({ createdAt: -1 })
//       .populate('learnerId', 'name email')
//       .populate('expertId', 'name email');

//     return res.status(200).json({
//       success: true,
//       sessions,
//     });
//   } catch (err) {
//     console.error('Get sessions error:', err);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// });

// // PATCH /sessions/:id/accept  -> expert accepts
// router.patch('/:id/accept', ensureAuthenticated, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const role = req.user.role;

//     if (role !== 'expert') {
//       return res.status(403).json({
//         success: false,
//         message: 'Only experts can accept sessions',
//       });
//     }

//     const session = await SessionModel.findOne({
//       _id: req.params.id,
//       expertId: userId,
//     });

//     if (!session) {
//       return res.status(404).json({
//         success: false,
//         message: 'Session not found or not yours',
//       });
//     }

//     session.status = 'accepted';

//     // simple video call link using Jitsi (no setup needed, just a URL)
//     if (!session.meetingLink) {
//       session.meetingLink = `https://meet.jit.si/xpertlink-${session._id}`;
//     }

//     await session.save();

//     return res.status(200).json({
//       success: true,
//       message: 'Session accepted',
//       session,
//     });
//   } catch (err) {
//     console.error('Accept session error:', err);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// });

// router.patch('/:id/reject', ensureAuthenticated, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const role = req.user.role;

//     if (role !== 'expert') {
//       return res.status(403).json({
//         success: false,
//         message: 'Only experts can reject sessions',
//       });
//     }

//     const session = await SessionModel.findOne({
//       _id: req.params.id,
//       expertId: userId,
//     });

//     if (!session) {
//       return res.status(404).json({
//         success: false,
//         message: 'Session not found or not yours',
//       });
//     }

//     session.status = 'rejected';
//     await session.save();

//     return res.status(200).json({
//       success: true,
//       message: 'Session rejected',
//       session,
//     });
//   } catch (err) {
//     console.error('Reject session error:', err);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// });



// module.exports = router;
