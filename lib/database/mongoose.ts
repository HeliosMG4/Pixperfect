import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL; // Fixed typo: MONGOBD_URL → MONGODB_URL

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseConnection | undefined;
}

const cached: MongooseConnection = global.mongoose || {  // Added missing "||" operator
    conn: null,
    promise: null,
};

if (!global.mongoose) {
    global.mongoose = cached;
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URL) throw new Error(' Missing MONGODB_URL ');

    cached.promise = cached.promise || // Added missing "||" operator
    mongoose.connect(MONGODB_URL, {
        dbName:'Pixperfect',
        bufferCommands: false
    });

    cached.conn = await cached.promise;
    return cached.conn;
}