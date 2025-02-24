import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseConnection | undefined;
}

// Fix the type error by properly typing the global variable
const cached: MongooseConnection = global.mongoose as MongooseConnection || {
    conn: null,
    promise: null,
};

if (!global.mongoose) {
    global.mongoose = cached;
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URL) throw new Error(' Missing MONGODB_URL ');

    cached.promise = cached.promise || 
    mongoose.connect(MONGODB_URL, {
        dbName:'Pixperfect',
        bufferCommands: false
    });

    cached.conn = await cached.promise;
    return cached.conn;
}
