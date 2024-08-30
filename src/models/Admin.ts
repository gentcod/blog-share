import mongoose, { Document, Schema, Types } from 'mongoose';
import { Auth } from './Auth';

export interface IAdmin extends Document {
   adminId: Types.ObjectId
   firstName: string;
   lastName: string;
   fullname: string;
}

export const customerSchema = new Schema<IAdmin>({
   adminId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: Auth
   },
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

export const AdminModel = mongoose.model<IAdmin>('Admins', customerSchema, 'admins');