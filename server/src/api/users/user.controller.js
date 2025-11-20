import { hash, compare } from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDB } from '../../config/db.js';

const sign = jsonwebtoken.sign

// Generate JWT Token
const generateToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Register user
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const db = getDB();
    const users = db.collection('users');
    
    
    // Check if user exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }
    
    // Hash password
    const hashedPassword = await hash(password, 10);
    
    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role || 'attendee',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await users.insertOne(newUser);
    const token = generateToken(result.insertedId.toString());
    
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: result.insertedId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = getDB();
    const users = db.collection('users');
    
    // Find user
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Compare password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    const token = generateToken(user._id.toString());
    
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getMe = async (req, res, next) => {
  try {
    const db = getDB();
    const users = db.collection('users');
    
    const user = await users.findOne(
      { _id: new ObjectId(req.user._id) },
      { projection: { password: 0 } }
    );
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

