import { Db, MongoClient, MongoClientOptions } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB;

if ( ! MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

let cached = global.mongo;

if ( ! cached) {
    cached = global.mongo = {
        conn: null,
        promise: null,
    };
}

const connectToDatabase = async (): Promise<{ client: MongoClient; db: Db }> => {
    if (cached.conn) {
        return cached.conn;
    }

    if ( ! cached.promise) {
        const opts: MongoClientOptions = {};

        cached.promise = MongoClient.connect(MONGODB_URI, opts).then(client => {
            return {
                client,
                db: client.db(MONGODB_DB),
            };
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

export default async function MongoService<T>(fn: (db: Db) => Promise<T>): Promise<T> {
    const conn = await connectToDatabase();
    return await fn(conn.db);
}
