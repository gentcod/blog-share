import express from 'express';
import userRouter from './user.routes';
import blogsRouter from './blog.routes';
import adminRouter from './admin.routes';

export const indexRouter = express.Router()

indexRouter.use('/api/v1', userRouter)
indexRouter.use('/api/v1', blogsRouter)
indexRouter.use('/api/v1', adminRouter)

export default indexRouter;