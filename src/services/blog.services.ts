import { Auth, AuthRoles } from "../models/Auth";
import { BlogDto, BlogResModel, BlogUpdateDto } from "../dtos/blog.dto";
import { BlogModel, BlogPendingModel, BlogStatus } from "../models/Blog";
import { BlogSearchParams } from "../dtos/helper.dto";
import { UserModel } from "../models/User";

export class BlogServices {
   public async getAllBlogs(searchParams: BlogSearchParams) {
      const { searchString, pageSize, pageId } = searchParams;
      const limit = pageSize && pageSize < 10 ? pageSize : 10;
      const firstIndex = (pageId - 1) * limit;

      const [count, blogs] = await Promise.all([
         BlogModel.countDocuments(
            searchString ? { title: { $regex: searchString, $options: 'i' } } : {}
         ),

         BlogModel.find(
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

   public async getSingleBlog(blogId: string) {
      const blog = await BlogModel.findById(blogId).populate('author');
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

   public async createBlog(blogDto: BlogDto) {
      const auth = await Auth.findById(blogDto.author);
      const user = await UserModel.findOne({ userId: auth.id });
      if (!auth || !user) {
         return {
            status: 401,
            message: 'Sorry, you are not allowed to perform this action'
         }
      }

      const blog = await BlogModel.findOne({ author: user._id, title: blogDto.title });
      const blogPending = await BlogPendingModel.findOne({ author: user._id, title: blogDto.title });
      if (blog || blogPending) {
         return {
            status: 400,
            message: 'Blogpost with this title already exists'
         }
      }

      const data = {...blogDto, author: user._id};

      const newBlog = auth.role != AuthRoles.USER ?
         await BlogModel.create(data)
         : await BlogPendingModel.create({ ...data, status: BlogStatus.CREATE })
      ;

      const response = BlogResModel.createBlogRes(newBlog);
      const message = auth.role != AuthRoles.USER
         ? 'Blog has been created successfully.'
         : 'Blog will be created after approval.'

      return {
         status: 200,
         message,
         data: response,
      }
   }

   public async updateBlog(blogId: string, authId: string, blogDto: BlogUpdateDto) {
      const auth = await Auth.findById(authId);
      const user = await UserModel.findOne({ userId: auth.id });

      if (!auth || !user) {
         return {
            status: 401,
            message: 'Sorry, you are not allowed to perform this action'
         }
      }

      const blog = await BlogModel.findById(blogId);
      if (!blog) {
         return {
            status: 404,
            message: 'Blogpost does not exist'
         }
      }

      if (blog.author.toString() !== user.id) {
         return {
            status: 401,
            message: 'You are not allowed to perform this action.'
         }
      }

      const data = {
         title: blogDto.title ? blogDto.title : blog.title,
         post: blogDto.post ? blogDto.post : blog.post,
      }
      auth.role != AuthRoles.USER ?
         await BlogModel.findByIdAndUpdate(blog.id, blogDto)
         : await BlogPendingModel.create({ ...data, author: user._id, blogId: blog.id, status: BlogStatus.UPDATE })
      ;

      const message = auth.role != AuthRoles.USER
         ? 'Blog has been updated successfully.'
         : 'Blog will be updated after approval.'

      return {
         status: 200,
         message,
      }
   }

   public async deleteBlog(authorId: string, blogId: string) {
      const auth = await Auth.findById(authorId);
      const user = await UserModel.findOne({ userId: auth.id });
      if (!auth || !user) {
         return {
            status: 401,
            message: 'Sorry, you are not allowed to perform this action'
         }
      }

      const blog = await BlogModel.findById(blogId);
      if (!blog) {
         return {
            status: 404,
            message: 'Blogpost does not exist'
         }
      }

      if (blog.author.toString() !== user.id) {
         return {
            status: 401,
            message: 'You are not allowed to perform this action.'
         }
      }

      const updatedBlog = auth.role != AuthRoles.USER ?
         await BlogModel.findByIdAndDelete(blog.id)
         : await BlogPendingModel.create({ 
            author: user.id, 
            title: blog.title, 
            post: blog.post, 
            blogId: blog.id,
            status: BlogStatus.DELETE 
         })
      ;

      console.log(updatedBlog);
      const message = auth.role != AuthRoles.USER
         ? 'Blog has been deleted successfully.'
         : 'Blog will be deleted after approval.'

      return {
         status: 200,
         message,
      }
   }
}