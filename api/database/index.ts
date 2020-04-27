import { MongoClient, Db, Collection } from 'mongodb';

export type TGame = {
  id: string;
};

let client = null;
const getDatabase = async (): Promise<Db> => {
  if (!client) {
    console.log('New connection to Mongo');
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

export { getDatabase, getCollection };
