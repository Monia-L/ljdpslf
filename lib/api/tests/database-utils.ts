import MongoClient from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { client as appClient } from '../database/utils';

// Extend the default timeout so MongoDB binaries can download
jest.setTimeout(60000);

// List your collection names here
const COLLECTIONS = ['games'];

interface TestDBManager {
  db: MongoClient.Db;
  server: MongoMemoryServer;
  connection: MongoClient.MongoClient;
  gamesCollection: MongoClient.Collection;
}

class TestDBManager {
  constructor() {
    this.db = null;
    this.server = new MongoMemoryServer();
    this.connection = null;

    this.gamesCollection = null;
  }

  async start(): Promise<void> {
    const url = await this.server.getConnectionString();
    this.connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.db = this.connection.db(await this.server.getDbName());
    process.env.DATABASE_URL = url;

    this.gamesCollection = this.db.collection('games');
  }

  async stop(): Promise<boolean> {
    appClient.close();
    this.connection.close();
    return this.server.stop();
  }

  cleanup(): Promise<MongoClient.DeleteWriteOpResultObject[]> {
    return Promise.all(
      COLLECTIONS.map((c) => this.db.collection(c).deleteMany({}))
    );
  }
}

export default TestDBManager;
