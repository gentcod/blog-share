import { Auth, AuthRoles } from "../models/Auth";
import { BlogResModel } from "../dtos/blog.dto";
import { BlogSearchParams } from "../dtos/helper.dto";
import { BlogModel, BlogPendingModel, BlogStatus } from "../models/Blog";
import { Types } from "mongoose";

export class AdminServices {
   public async getAllPendingBlogs(authId: string, searchParams: BlogSearchParams) {
      const auth = await Auth.findById(authId);
      if (!auth || auth.role !== AuthRoles.ADMIN) {
         return {
            status: 401,
            message: 'Sorry, you are not allowed to perform this action'
         }
      }

      const { searchString, pageSize, pageId } = searchParams;
      const limit = pageSize && pageSize < 10 ? pageSize : 10;
      const firstIndex = (pageId - 1) * limit;

      const [count, blogs] = await Promise.all([
         BlogPendingModel.countDocuments(
            searchString ? { title: { $regex: searchString, $options: 'i' } } : {}
         ),

         BlogPendingModel.find(
            searchString ? { title: { $regex: searchString, $options: 'i' } } : {}
         )
            .skip(firstIndex || 0)
            .limit(limit)
            .populate({
               path: 'author',
               select: 'firstName lastName'
            })
            .exec()
      ]);

      const totalPage = Math.ceil(count / limit) || 0;
      const currentPage = pageId ? pageId : 1;
      const nextPage = currentPage < totalPage ? currentPage + 1 : 0;
      const response = blogs.map(blog => BlogResModel.fetchMultipleBlogRes(blog));

      return {
         status: 200,
         message: 'Blogs have been fetched successfully.',
         data: {
            blogs: response,
            page: {
               totalCount: count > 0 ? count : 0,
               totalPage,
               currentPage,
               nextPage
            }
         }
      }
   }

   public async getSinglePendingBlog(authId: string, blogId: string) {
      const auth = await Auth.findById(authId);
      if (!auth || auth.role !== AuthRoles.ADMIN) {
         return {
            status: 401,
            message: 'Sorry, you are not allowed to perform this action'
         }
      }

      const blog = await BlogPendingModel.findById(blogId).populate('author');
      if (!blog) {
         return {
            status: 404,
            message: 'Blogpost does not exist'
         }
      }      

      const response = BlogResModel.fetchBlogRes(blog);
      return {
         status: 200,
         message: 'Blog has been fetched successfully.',
         data: response,
      }
   }

   public async approveCreateBlog(authId: string, blogIds: string[]) {
      const auth = await Auth.findById(authId);
      if (!auth || auth.role !== AuthRoles.ADMIN) {
         return {
            status: 401,
            message: 'You are not allowed to perform this action'
         }
      }

      const blogObjectIds: Types.ObjectId[] = blogIds.map(id => new Types.ObjectId(id));
      const approvedBlogs = await BlogModel.find({_id: { $in: (blogObjectIds) }});
      if (approvedBlogs.length > 0) return {
         status: 400,
         message: "One or more blog(s) has/have been previously approved"
      };

      const pendingBlogs = await BlogPendingModel.find({_id: { $in: (blogObjectIds) }, status: BlogStatus.CREATE});
      if (pendingBlogs.length !== blogIds.length) return {
         status: 404,
         message: "One or more blog(s) doesn't/do not exist"
      };

      const blogMgrpromise = pendingBlogs.map((pendingBlog) => {
         return Promise.all([
            BlogModel.create(
               {
                 title: pendingBlog.title,
                 post: pendingBlog.post,
                 author: pendingBlog.author,
               }
            ),
            BlogPendingModel.findByIdAndDelete(pendingBlog._id),
         ]);
      })

      await blogMgrpromise;

      return {
         status: 200,
         message: 'Blog(s) creation has been approved successfully.',
      }
   }

   
   public async approveUpdateBlog(authId: string, blogIds: string[]) {
      const auth = await Auth.findById(authId);
      if (!auth || auth.role !== AuthRoles.ADMIN) {
         return {
            status: 401,
            message: 'You are not allowed to perform this action'
         }
      }

      const blogObjectIds: Types.ObjectId[] = blogIds.map(id => new Types.ObjectId(id));

      const pendingBlogs = await BlogPendingModel.find({_id: { $in: (blogObjectIds) }, status: BlogStatus.UPDATE});
      if (pendingBlogs.length !== blogIds.length) return {
         status: 404,
         message: "One or more blog(s) doesn't/do not exist"
      };

      const blogMgrpromise = pendingBlogs.map((pendingBlog) => {
         return Promise.all([
            BlogModel.findByIdAndUpdate(
               pendingBlog.blogId,
               {
                 title: pendingBlog.title,
                 post: pendingBlog.post,
                 author: pendingBlog.author,
               }
            ),
            BlogPendingModel.findByIdAndDelete(pendingBlog._id),
         ]);
      })

      await blogMgrpromise;

      return {
         status: 200,
         message: 'Blog(s) update has been approved successfully.',
      }
   }

   public async approveDeleteBlog(authId: string, blogIds: string[]) {
      const auth = await Auth.findById(authId);
      if (!auth || auth.role !== AuthRoles.ADMIN) {
         return {
            status: 401,
            message: 'You are not allowed to perform this action'
         }
      }

      const blogObjectIds: Types.ObjectId[] = blogIds.map(id => new Types.ObjectId(id));
      const approvedBlogs = await BlogModel.find({_id: { $in: (blogObjectIds) }});
      
      if (approvedBlogs.length > 0) return {
         status: 400,
         message: "One or more blog(s) has/have been previously approved"
      };

      const pendingBlogs = await BlogPendingModel.find({_id: { $in: (blogObjectIds) }, status: BlogStatus.DELETE});
      if (pendingBlogs.length !== blogIds.length) return {
         status: 404,
         message: "One or more blog(s) doesn't/do not exist"
      };

      const blogMgrpromise = pendingBlogs.map((pendingBlog) => {
         return Promise.all([
            BlogModel.findByIdAndDelete(pendingBlog.blogId),
            BlogPendingModel.findByIdAndDelete(pendingBlog._id),
         ]);
      })

      await blogMgrpromise;

      return {
         status: 200,
         message: 'Blog(s) delete has been approved successfully.',
      }
   }
}