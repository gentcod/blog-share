import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMid } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateReqMiddleware';
import { BlogIdValidation } from '../validations/admin.validation';

const adminRouter = express.Router();
const adminController = new AdminController();

adminRouter.route('/admin/blogs/pending').get(
   authMid,
   adminController.getAllPendingBlogs
);
adminRouter.route('/admin/blogs/pending/:id').get(
   authMid,
   adminController.getSinglePendingBlog
);

adminRouter.route('/admin/blogs/pending/create').post(
   authMid,
   validateRequest(BlogIdValidation),
   adminController.approveCreateBlog
);

adminRouter.route('/admin/blogs/pending/update').put(
   authMid,
   validateRequest(BlogIdValidation),
   adminController.approveUpdateBlog
);

adminRouter.route('/admin/blogs/pending/delete').delete(
   authMid,
   validateRequest(BlogIdValidation),
   adminController.approveDeleteBlog
);

export default adminRouter;