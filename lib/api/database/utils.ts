import { MongoClient, Db, Collection } from 'mongodb';

let client = null;
const getDatabase = async (): Promise<Db> => {
  if (!client) {
    console.log('New connection to Mongo', process.env.DATABASE_URL);
    client = await MongoClient.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return client.db();
};

const getCollection = async (name: string): Promise<Collection> => {
  const database = await getDatabase();
  return database.collection(name);
};

export { client, getDatabase, getCollection };
