const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // If no URI or local connection fails, fallback to MongoMemoryServer for instant seamless dev
    if (!uri || uri.includes('memory') || uri === 'undefined') {
      try {
        console.log('⚡ Initializing in-memory MongoDB for local development...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        console.log(`✅ In-memory MongoDB started at: ${uri}`);
      } catch (memErr) {
        console.warn('⚠️ Could not start MongoMemoryServer, using default fallback URI:', memErr.message);
        uri = uri || 'mongodb://127.0.0.1:27017/campusfind';
      }
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If standard connection failed and we haven't tried memory server, try fallback
    try {
      console.log('⚡ Attempting fallback to MongoMemoryServer...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ Connected to Fallback In-Memory MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (fallbackErr) {
      console.error(`❌ Fallback MongoDB Connection Failed: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
