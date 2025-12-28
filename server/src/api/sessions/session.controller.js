import { ObjectId } from 'mongodb';
import { getDB } from '../../config/db.js';
import { generateRtcToken } from '../../config/agora.js';

export const getAgoraToken = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const db = getDB();
    const events = db.collection('events');

    const event = await events.findOne({ _id: new ObjectId(eventId) });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const role = event.hostId.toString() === req.user._id.toString()
      ? 'publisher'
      : 'subscriber';

    const token = generateRtcToken(
      event.agoraChannel,
      req.user._id.toString(),
      role
    );

    // Find active session for this event to return sessionId
    const sessions = db.collection('sessions');
    const activeSession = await sessions.findOne({
      eventId: new ObjectId(eventId),
      endedAt: { $exists: false }
    });

    res.status(200).json({
      success: true,
      token,
      channel: event.agoraChannel,
      uid: req.user._id.toString(),
      sessionId: activeSession ? activeSession._id.toString() : null
    });
  } catch (error) {
    next(error);
  }
};

export const startSession = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const db = getDB();
    const sessions = db.collection('sessions');
    const events = db.collection('events');

    // Check if user is the event creator
    const event = await events.findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.hostId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the event creator can start the session'
      });
    }

    // Check if session already exists
    const existingSession = await sessions.findOne({
      eventId: new ObjectId(eventId),
      endedAt: { $exists: false }
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'Session already started'
      });
    }

    const newSession = {
      eventId: new ObjectId(eventId),
      startedAt: new Date(),
      participants: [{
        userId: new ObjectId(req.user._id),
        joinedAt: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await sessions.insertOne(newSession);
    await events.updateOne(
      { _id: new ObjectId(eventId) },
      { $set: { status: 'live' } }
    );

    res.status(201).json({
      success: true,
      data: { ...newSession, _id: result.insertedId }
    });
  } catch (error) {
    next(error);
  }
};

// Get session status for waiting room
export const getSessionStatus = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const db = getDB();
    const events = db.collection('events');
    const sessions = db.collection('sessions');

    const event = await events.findOne({ _id: new ObjectId(eventId) });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if there's an active session
    const activeSession = await sessions.findOne({
      eventId: new ObjectId(eventId),
      endedAt: { $exists: false }
    });

    const isHost = req.user._id.toString() === event.hostId.toString();

    res.status(200).json({
      success: true,
      data: {
        eventId,
        eventStatus: event.status,
        sessionStarted: !!activeSession,
        sessionId: activeSession ? activeSession._id.toString() : null,
        isHost
      }
    });
  } catch (error) {
    next(error);
  }
};

export const endSession = async (req, res, next) => {
  try {
    const db = getDB();
    const sessions = db.collection('sessions');
    const events = db.collection('events');

    const session = await sessions.findOne({ _id: new ObjectId(req.params.id) });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const result = await sessions.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          endedAt: new Date(),
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    await events.updateOne(
      { _id: session.eventId },
      { $set: { status: 'ended' } }
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
