import { Request, Response, NextFunction } from 'express';
import { AdminServices } from '../services/admin.services';
import { sendApiResponse, sendInternalErrorResponse} from '../utils/apiResponse';
import { MiddlewareReq } from '../middlewares/authMiddleware';

export class AdminController {

   public async getAllPendingBlogs(req: Request, res: Response, next: NextFunction) {
      try {
         const { id } = (req as MiddlewareReq).authPayload;
         const { pageId, pageSize, search, status } = req.query;
         const size = Number(pageSize);
         const pageNum = Number(pageId);
         
         const result = await new AdminServices().getAllPendingBlogs(id, {
            pageSize: size, 
            pageId: pageNum, 
            searchString: (search as string),
            filter: (status as string),
         });
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

   public async getSinglePendingBlog(req: Request, res: Response, next: NextFunction) {
      try {
         const { id } = (req as MiddlewareReq).authPayload;
         const blogId = req.params.id as string;         
         const result = await new AdminServices().getSinglePendingBlog(id, blogId);
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

   public async approveCreateBlog(req: Request, res: Response, next: NextFunction) {
      try {
         const { id } = (req as MiddlewareReq).authPayload;
         const result = await new AdminServices().approveCreateBlog(id, req.body.blogIds);
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

   public async approveUpdateBlog(req: Request, res: Response, next: NextFunction) {
      try {
         const { id } = (req as MiddlewareReq).authPayload;
         const result = await new AdminServices().approveUpdateBlog(id, req.body.blogIds);
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

   public async approveDeleteBlog(req: Request, res: Response, next: NextFunction) {
      try {
         const { id } = (req as MiddlewareReq).authPayload;
         const result = await new AdminServices().approveDeleteBlog(id, req.body.blogIds);
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
