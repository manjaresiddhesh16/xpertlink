const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema(
  {
    learnerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    expertId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    topic: {
      type: String,
      required: true
    },
    doubtText: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending'
    },
    scheduledFor: {
      type: Date,   // optional, for future scheduled sessions
    },
    price: {
      type: Number, // optional, you can fill from expert.price later
    },
    meetingLink: {
      type: String  // later you can store Jitsi/Zoom link
    }
  },
  { timestamps: true }
);

const SessionModel = mongoose.model('sessions', SessionSchema);
module.exports = SessionModel;
