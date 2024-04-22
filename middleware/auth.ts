import { NextFunction, Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import { UserFields } from '../types';
import User from '../models/User';

interface RequestWithUser extends Request {
  user: HydratedDocument<UserFields>;
}

const auth = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.get('Authorization');

  if (!token) {
    return res.status(400).send({ error: 'Token not provided' });
  }

  const user = await User.findOne({ token: token });

  if (!user) {
    return res.status(401).send({ error: 'Invalid token' });
  }

  req.user = user;

  next();
};

export default auth;
