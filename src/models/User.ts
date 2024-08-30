import mongoose, { Document, Schema, Types } from 'mongoose';
import { Auth } from './Auth';

export interface IUser extends Document {
   userId: Types.ObjectId;
   username: string;
   firstName: string;
   lastName: string;
   fullName: string;
}

export const customerSchema = new Schema<IUser>({
   userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: Auth
   },
   username: { type: String, unique: true, required: true },
   firstName: { type: String, required: true },
   lastName: { type: String, required: true },
},
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
);

customerSchema.virtual('fullName').get(function () {
   return `${this.firstName} ${this.lastName}`;
});

export const UserModel = mongoose.model<IUser>('Users', customerSchema, 'users');