import express from 'express';
import { BlogController } from '../controllers/blog.controller';
import { validateRequest } from '../middlewares/validateReqMiddleware';
import { BlogUpdateValidation, BlogValidation } from '../validations/blog.validation';
import { authMid } from '../middlewares/authMiddleware';

const blogsRouter = express.Router();
const blogController = new BlogController();

blogsRouter.route('/blogs').get(blogController.getAllBlogs);

blogsRouter.route('/blogs/:id').get(blogController.getSingleBlog);

blogsRouter.route('/blogs/create').post(
   authMid,
   validateRequest(BlogValidation),
   blogController.createBlog
);

blogsRouter.route('/blogs/update/:id').put(
   authMid,
   validateRequest(BlogUpdateValidation),
   blogController.updateBlog
);

blogsRouter.route('/blogs/delete/:id').delete(
   authMid,
   blogController.deleteBlog
);

export default blogsRouter;