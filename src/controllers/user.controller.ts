import { Request, Response, NextFunction } from 'express';
import { UserServies } from '../services/user.services';
import { sendApiResponse, sendInternalErrorResponse} from '../utils/apiResponse';

export class UserController {
   public async createUser(req: Request, res: Response, next: NextFunction) {
      try {   
         const result = await new UserServies().createUser(req.body);
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

   public async loginUser(req: Request, res: Response, next: NextFunction) {
      try {         
         const result = await new UserServies().loginUser(req.body);
         return sendApiResponse(res, {
            status: result.status,
            message: result.message,
            data: result.data,
         });
      }
      catch (err) {
         sendInternalErrorResponse(res, err);
         next(err);
      }
   };

   // public async getUser(req: Request, res: Response, next: NextFunction) {
   //    try {   
   //       const result = await new UserServies().getUser();
   //       return sendApiResponse(res, {
   //          status: result.status,
   //          message: result.message,
   //          data: result.data,
   //       });
   //    }
   //    catch (err) {
   //       sendInternalErrorResponse(res, err);
   //       next(err);
   //    }
   // };
}
