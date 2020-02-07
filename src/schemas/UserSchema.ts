/* eslint-disable no-unused-vars */
import { Schema, Document, model, DocumentQuery } from 'mongoose';

import { getImageGravatar } from '../helpers';
import { UserInterface } from '../interfaces/UserInterface';

export type UserSchemaType = Document &
  UserInterface & {
    getFormattedAddress(): string;
    findByEmail(email: string): DocumentQuery<any, any, {}>;
  };

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual('gravatar').get(function gravatar() {
  return getImageGravatar(String(this.email).toLowerCase(), { s: 50 });
});

UserSchema.methods.getFormattedAddress = function formattedAddress(): string {
  return `${this.name} <${this.email}>`;
};

UserSchema.static('findByEmail', function findByEmail(
  email: string
): DocumentQuery<any, any, {}> {
  return this.findOne({ email });
});

// Middleware
// UserSchema.pre('save', function(next) {
//   next();
// });

export default model<UserSchemaType>('UserSchema', UserSchema);
