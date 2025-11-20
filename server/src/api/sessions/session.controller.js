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
    
    res.status(200).json({
      success: true,
      token,
      channel: event.agoraChannel,
      uid: req.user._id.toString()
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
