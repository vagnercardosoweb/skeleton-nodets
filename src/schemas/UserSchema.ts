/* eslint-disable no-unused-vars */
import { Schema, Document, model, DocumentQuery } from 'mongoose';
import { UserInterface } from '../interfaces/UserInterface';
import { getImageGravatar } from '../helpers';

export interface UserSchemaInterface extends UserInterface, Document {
  getFormattedAddress(): string;
  findByEmail(email: string): DocumentQuery<any, any, {}>;
}

const UserSchema = new Schema<UserSchemaInterface>(
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

UserSchema.virtual('image').get(function gravatar() {
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

export default model<UserSchemaInterface>('UserSchema', UserSchema);
