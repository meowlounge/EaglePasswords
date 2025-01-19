import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

/**
 * A class to manage MongoDB connections and handle multiple database instances.
 */
export class Database {
    private static instance: Database;
    private client: MongoClient;
    private db?: Db;

    private constructor() {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in the environment variables.');
        }
        this.client = new MongoClient(uri);
    }

    /**
     * Returns a singleton instance of the `Database` class.
     */
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    /**
     * Connects to a MongoDB database. If already connected, returns the existing connection.
     * @param {string} dbName - The name of the database to connect to.
     * @returns {Promise<Db>} The MongoDB database instance.
     * @throws {Error} Throws an error if the connection fails.
     */
    public async connect(dbName: string = "EaglePasswords"): Promise<Db> {
        if (!this.db || this.db.databaseName !== dbName) {
            await this.client.connect();
            this.db = this.client.db(dbName);
        }
        return this.db;
    }

    /**
     * Closes the MongoDB client connection.
     */
    public async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            this.db = undefined;
        }
    }
}
