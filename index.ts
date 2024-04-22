import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config';
import usersRouter from './routers/users';
import tasksRouter from './routers/tasks';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

const run = async () => {
  await mongoose.connect(config.mongoose.db);

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run();
