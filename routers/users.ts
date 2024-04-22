import express from 'express';
import User from '../models/User';
import mongoose, { mongo } from 'mongoose';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    user.generateToken();

    await user.save();
    return res.send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    if (error instanceof mongo.MongoServerError && error.code === 11000) {
      return res.status(422).send(error);
    }
    next(error);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res
        .status(400)
        .send({ error: 'Username or password is not correct' });
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      return res
        .status(400)
        .send({ error: 'Username or password is not correct' });
    }

    user.generateToken();
    await user.save();

    return res.send({ message: 'Username and password correct!', user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    next(error);
  }
});

export default usersRouter;
