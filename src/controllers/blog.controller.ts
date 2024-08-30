import { Request, Response, NextFunction } from 'express';
import { sendApiResponse, sendInternalErrorResponse } from '../utils/apiResponse';
import { BlogServices } from '../services/blog.services';
import { MiddlewareReq } from '../middlewares/authMiddleware';

export class BlogController {

   public async getAllBlogs(req: Request, res: Response, next: NextFunction) {
      try {
         const { pageId, pageSize, searchString } = req.query;
         const size = Number(pageSize);
         const pageNum = Number(pageId);
         
         const result = await new BlogServices().getAllBlogs({pageSize: size, pageId: pageNum, searchString: (searchString as string)});
         return sendApiResponse(res, {
            status: result.status,
            message: result.message,
            data: result.data
         });
      }
      catch (err) {
         sendInternalErrorResponse(res, err);
         next(err);
      }
   };

   public async getSingleBlog(req: Request, res: Response, next: NextFunction) {
      try {
         const blogId = req.params.id as string;         
         const result = await new BlogServices().getSingleBlog(blogId);
         return sendApiResponse(res, {
            status: result.status,
            message: result.message,
            data: result.data
         });
      }
      catch (err) {
         sendInternalErrorResponse(res, err);
         next(err);
      }
   };

   public async createBlog(req: Request, res: Response, next: NextFunction) {
      try {
         const { id } = (req as MiddlewareReq).authPayload;
         const result = await new BlogServices().createBlog({author: id, ...req.body});
         return sendApiResponse(res, {
            status: result.status,
            message: result.message,
            data: result.data
         });
      }
      catch (err) {
         sendInternalErrorResponse(res, err);
         next(err);
      }
   };

   public async updateBlog(req: Request, res: Response, next: NextFunction) {
      try {
         const { id } = (req as MiddlewareReq).authPayload;
         const blogId = req.params.id as string;
         const result = await new BlogServices().updateBlog(blogId, id, req.body);
         return sendApiResponse(res, {
            status: result.status,
            message: result.message,
            // data: result.data
         });
      }
      catch (err) {
         sendInternalErrorResponse(res, err);
         next(err);
      }
   };

   public async deleteBlog(req: Request, res: Response, next: NextFunction) {
      try {
         const { id } = (req as MiddlewareReq).authPayload;
         const blogId = req.params.id as string;
         const result = await new BlogServices().deleteBlog(id, blogId);
         return sendApiResponse(res, {
            status: result.status,
            message: result.message,
         });
      }
      catch (err) {
         sendInternalErrorResponse(res, err);
         next(err);
      }
   };
}
