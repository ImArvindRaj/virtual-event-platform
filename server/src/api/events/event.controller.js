import { ObjectId } from 'mongodb';
import { getDB } from '../../config/db.js';

export const createEvent = async (req, res, next) => {
  try {
    const db = getDB();
    const events = db.collection('events');
    
    const newEvent = {
      ...req.body,
      hostId: new ObjectId(req.user._id),
      attendees: [],
      status: 'upcoming',
      agoraChannel: `event_${new ObjectId()}_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await events.insertOne(newEvent);
    
    res.status(201).json({
      success: true,
      data: { ...newEvent, _id: result.insertedId }
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const db = getDB();
    const events = db.collection('events');
    
    const allEvents = await events
      .find({})
      .sort({ scheduledAt: 1 })
      .toArray();
    
    res.status(200).json({
      success: true,
      count: allEvents.length,
      data: allEvents
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const db = getDB();
    const events = db.collection('events');
    
    const event = await events.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const db = getDB();
    const events = db.collection('events');
    
    const event = await events.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    if (event.hostId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this event' 
      });
    }
    
    const result = await events.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { 
        $set: { 
          ...req.body, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const db = getDB();
    const events = db.collection('events');
    
    const event = await events.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    if (event.hostId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this event' 
      });
    }
    
    await events.deleteOne({ _id: new ObjectId(req.params.id) });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

export const joinEvent = async (req, res, next) => {
  try {
    const db = getDB();
    const events = db.collection('events');
    
    const event = await events.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    const userId = new ObjectId(req.user._id);
    
    const alreadyJoined = event.attendees.some(id => id.equals(userId));
    if (alreadyJoined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already joined this event' 
      });
    }
    
    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ 
        success: false, 
        message: 'Event is full' 
      });
    }
    
    const result = await events.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { 
        $push: { attendees: userId },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
