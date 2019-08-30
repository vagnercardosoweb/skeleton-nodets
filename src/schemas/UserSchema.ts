import { UserSchemaInterface } from './UserSchema';
import { Schema, Document, model, DocumentQuery } from 'mongoose';
import { UserInterface } from '../interfaces/UserInterface';
import { createHashMd5 } from '../helpers';

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

UserSchema.virtual('image').get(function() {
  const md5 = createHashMd5(this.email.toLowerCase());

  return `https://www.gravatar.com/avatar/${md5}?s=500`;
});

UserSchema.methods.getFormattedAddress = function(): string {
  return `${this.name} <${this.email}>`;
};

UserSchema.static('findByEmail', function(
  email: string
): DocumentQuery<any, any, {}> {
  return this.findOne({ email });
});

// Middleware
// UserSchema.pre('save', function(next) {
//   next();
// });

export default model<UserSchemaInterface>('User', UserSchema);
