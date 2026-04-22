import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

/**
 * Starts an in-memory MongoDB server and injects its URI into process.env.
 * Only used in development when USE_MEMORY_DB=true.
 */
export async function startMemoryDb() {
  console.log('🧪 Starting in-memory MongoDB (no install required)...');
  mongod = await MongoMemoryServer.create({
    instance: {
      dbName: 'crowdfundingx',
    },
  });
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  console.log('✅ In-memory MongoDB ready at:', uri);
  return uri;
}

export async function stopMemoryDb() {
  if (mongod) {
    await mongod.stop();
    console.log('🛑 In-memory MongoDB stopped.');
  }
}
