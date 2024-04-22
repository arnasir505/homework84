import { Schema, Types, model } from 'mongoose';
import User from './User';

const TaskSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      validate: {
        validator: async (id: Types.ObjectId) => User.findById(id),
        message: 'User does not exist',
      },
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ['new', 'in_progress', 'complete'],
      default: 'new',
    },
  },
  {
    versionKey: false,
  }
);

const Task = model('Task', TaskSchema);

export default Task;
