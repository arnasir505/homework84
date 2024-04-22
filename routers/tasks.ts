import express from 'express';
import mongoose from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import { TaskFields, TaskFieldsWithoutUser } from '../types';
import Task from '../models/Task';

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const taskData: TaskFields = {
      user: req.user._id.toString(),
      title: req.body.title,
      description: req.body.description || null,
      status: req.body.status,
    };

    const task = new Task(taskData);
    await task.save();

    return res.send(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
});

tasksRouter.get('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const userTasks = await Task.find({ user: req.user?._id });
    return res.send(userTasks);
  } catch (error) {
    next(error);
  }
});

tasksRouter.put('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.body.title) {
      return res.status(400).send({ error: 'Title field must be present' });
    }

    const id = req.params.id;

    const taskData: TaskFieldsWithoutUser = {
      title: req.body.title,
      description: req.body.description || null,
      status: req.body.status,
    };

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user?.id },
      taskData,
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(403)
        .send({ error: 'Permission denied / Task not found' });
    }

    await updatedTask.save();
    return res.send(updatedTask);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
});

tasksRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    const id = req.params.id;
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      user: req.user?.id,
    });

    if (!deletedTask) {
      return res
        .status(403)
        .send({ error: 'Permission denied / Task not found' });
    }

    return res.send(deletedTask);
  } catch (error) {
    next(error);
  }
});

export default tasksRouter;
