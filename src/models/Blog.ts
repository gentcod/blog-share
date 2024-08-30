import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBlog extends Document {
   author: Types.ObjectId;
   title: string;
   post: string;
   // tags?: string[];
   // comments?: IComment[];
}

// export interface IComment {
//    userId: Types.ObjectId;
//    comment: string;
// }

export interface IBlogPending extends IBlog {
   blogId?: Types.ObjectId;
   status: BlogStatus;
}

export enum BlogStatus {
   CREATE = 'create',
   UPDATE = 'update',
   DELETE = 'delete',
}

export const blogSchema = new Schema<IBlog>(
   {
      author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
      title: { type: String, required: true, },
      post: { type: String, required: true },
      // tags: [{ type: String, required: true }],
      // comments: [
      //    {
      //       userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
      //       comment: { type: String, required: true },
      //    }
      // ]
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
);

export const blogPendingSchema = new Schema<IBlogPending>(
   {
      author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
      title: { type: String, required: true, },
      post: { type: String, required: true },
      status: { type: String, enum: Object.values(BlogStatus), required: true, default: BlogStatus.CREATE },
      blogId: { type: Schema.Types.ObjectId, ref: 'Users', required: false },

   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
);

export const BlogModel = mongoose.model<IBlog>('Blogs', blogSchema, 'blogs');

export const BlogPendingModel = mongoose.model<IBlogPending>('BlogsPending', blogPendingSchema, 'blogsPending');

// NB: Comments and Tags are left out to avoid over-engineering...