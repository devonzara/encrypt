import { Db, ObjectId } from 'mongodb';
import MongoService from '../services/mongo';
import { generateSlug, RandomWordOptions } from 'random-word-slugs';

const options: RandomWordOptions<4> = {
    format: 'camel',
    partsOfSpeech: ['adjective', 'adjective', 'adjective', 'noun'],
};

export default class Message {
    constructor(
        public slug: string,
        public payload: string,
        public password?: string,
        public _id?: ObjectId,
        public created_at: Date = new Date()) {}

    static async removeExpiredMessages() {
        let date = new Date();
        date.setDate(date.getDate() - 30);
        return await Message.removeMany({ created_at: { $lt: date } });
    }

    static async create(payload: string, password: string): Promise<Message | false> {
        let slug: string;
        let slugIsNotUnique = true;
        for (let tries = 4; tries > 0 && slugIsNotUnique; tries--) {
            slug = generateSlug(4, options);
            slugIsNotUnique = await this.existsBySlug(slug);
        }

        if (slugIsNotUnique) return false;

        return await MongoService(async (db: Db) => {
            const message = new Message(slug, payload, password);
            const collection = db.collection<Message>('messages');
            const doc = await collection.insertOne(message);
            message._id = doc.insertedId;
            return message;
        });
    }

    static async existsBySlug(slug: string) : Promise<boolean> {
        return !! (await this.findBySlug(slug));
    }

    static async findBySlug(slug: string): Promise<Message | null> {
        return await this.findOne({ slug });
    }

    static async findOne(filter: object): Promise<Message | null> {
        return await MongoService(async (db: Db) => {
            const collection = db.collection<Message>('messages');
            return (await collection.findOne(filter)) as Message;
        });
    }

    static async removeOne(filter: object): Promise<any> {
        return await MongoService(async (db: Db) => {
            const collection = db.collection<Message>('messages');
            return await collection.deleteOne(filter);
        });
    }

    static async removeMany(filter: object): Promise<any> {
        return await MongoService(async (db: Db) => {
            const collection = db.collection<Message>('messages');
            return await collection.deleteMany(filter);
        });
    }

    static async verifyPassword(slug: string, password: string): Promise<boolean> {
        const result = !! (await MongoService(async (db: Db) => {
            const collection = db.collection<Message>('messages');
            const found = (await collection.findOne({ slug: slug })) as Message;
            console.log('found', found);
            return found;
        }));

        console.log('result', result);

        return result;
    }
}
