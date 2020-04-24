import { MongoClient, Db, Collection } from 'mongodb';

let client = null;

const getClient = async (): Promise<MongoClient> => {
  console.log('Connecting to Mongo');
  return MongoClient.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const getDatabase = async (): Promise<Db> => {
  if (!client) {
    client = await getClient();
  }

  return client.db();
};

const getCollection = async (name: string): Promise<Collection> => {
  const database = await getDatabase();
  return database.collection(name);
};

export { getDatabase, getCollection };
