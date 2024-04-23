import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Task from './models/Task';

const dropCollection = async (
  db: mongoose.Connection,
  collectionName: string
) => {
  try {
    await db.dropCollection(collectionName);
  } catch (error) {
    console.log(`Collection ${collectionName} is missing. Skipping drop...`);
  }
};

const collections: string[] = ['users', 'tasks'];

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  for (const collection of collections) {
    await dropCollection(db, collection);
  }

  const [user1, user2] = await User.create(
    {
      username: 'John',
      password: 'john123',
      token: crypto.randomUUID(),
    },
    {
      username: 'Anna',
      password: 'anna123',
      token: crypto.randomUUID(),
    }
  );

  await Task.create(
    {
      user: user1._id,
      title: 'Go for a walk',
      description: null,
      status: 'new',
    },
    {
      user: user2._id,
      title: 'Water plants',
      description: 'Water plants in a kitchen',
      status: 'new',
    }
  );

  await db.close();
};

void run().catch(console.error);
