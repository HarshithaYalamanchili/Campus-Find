const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // If MONGODB_URI is provided (Atlas / Cloud DB), connect directly
    if (uri && uri.trim() !== '' && !uri.includes('memory') && uri !== 'undefined') {
      const conn = await mongoose.connect(uri.trim());
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} / ${conn.connection.name}`);
      return conn;
    }

    // Otherwise (local dev with no URI), fallback to MongoMemoryServer
    try {
      console.log('⚡ Initializing in-memory MongoDB for local development...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log(`✅ In-memory MongoDB started at: ${uri}`);
    } catch (memErr) {
      console.warn('⚠️ Could not start MongoMemoryServer, using default fallback URI:', memErr.message);
      uri = 'mongodb://127.0.0.1:27017/campusfind';
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
