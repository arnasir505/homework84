import express from 'express';
import mongoose, { mongo } from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import { TaskFields } from '../types';
import Task from '../models/Task';

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).send({ error: 'Test error' });
    }

    const taskData: TaskFields = {
      user: req.user._id.toString(),
      title: req.body.title,
      description: req.body.descripttion || null,
      status: req.body.status,
    };

    const task = new Task(taskData);
    await task.save();

    return res.send(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(error);
    }
    if (error instanceof mongo.MongoServerError && error.code === 11000) {
      return res.status(422).send(error);
    }
    next(error);
  }
});

export default tasksRouter;
