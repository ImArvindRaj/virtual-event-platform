import { MongoClient } from "mongodb";

let db;
let client;

export const connectDB = async () => {
  try {
    if (db) {
      console.log('Using existing MongoDB connection');
      return db;
    }

    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Create MongoClient with connection pooling
    client = new MongoClient(uri, {
      maxPoolSize: 50,
      minPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    
    const dbName = process.env.DB_NAME || 'event-platform';
    db = client.db(dbName);

    console.log(`MongoDB connected successfully to database: ${dbName}`);

    // Create indexes
    await createIndexes();

    return db;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // User indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    // Event indexes
    await db.collection('events').createIndex({ hostId: 1 });
    await db.collection('events').createIndex({ status: 1 });
    await db.collection('events').createIndex({ scheduledAt: 1 });
    await db.collection('events').createIndex({ agoraChannel: 1 }, { unique: true });

    // Session indexes
    await db.collection('sessions').createIndex({ eventId: 1 });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

// Get database instance
export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

// Close database connection
export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};
