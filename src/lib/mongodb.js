
// src/lib/mongodb.js
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

// Check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error('Define the MONGODB_URI environmental variable');
}

// Check the MongoDB DB
if (!MONGODB_DB) {
  throw new Error('Define the MONGODB_DB environmental variable');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // check the cached.
  if (cachedClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // Connect to cluster
  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");

  } catch (e) {
    console.error("Error connecting to MongoDB:", e);
    throw new Error('Could not connect to MongoDB');
  }


  let db = client.db(MONGODB_DB);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}

// Helper function to get the members collection
export async function getMembersCollection() {
    const { db } = await connectToDatabase();
    return db.collection('members');
}
