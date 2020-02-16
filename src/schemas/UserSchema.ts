/* eslint-disable no-unused-vars */
import { Document, DocumentQuery, Model, model, Schema } from 'mongoose';

import { IUser } from '../interfaces';
import { Password } from '../lib';

export interface IUserSchema extends IUser, Document {
  findByEmail(email: string): DocumentQuery<IUserSchema, IUserSchema>;
}

const UserSchema: Schema<IUserSchema> = new Schema<IUserSchema>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.pre<IUserSchema>('save', async function preSave(next) {
  if (this.isModified('password')) {
    this.password = await Password.create(this.password);
  }

  next();
});

UserSchema.loadClass(
  class UserClass extends Model {
    static findByEmail(email: string): DocumentQuery<IUserSchema, IUserSchema> {
      return this.findOne({ email });
    }
  }
);

export default model<IUserSchema>('users', UserSchema);
