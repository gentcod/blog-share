import { IAuth } from "../models/Auth";
import { IUser } from "../models/User";

export class SignUpDto {
   email: string;
   password: string;
   username: string;
   firstName: string
   lastName: string;
   role: string;
}

export class LoginDto {
   email: string;
   password: string;
}

export class UserDto {
   id: string;
   email: string;
   username: string;
   fullName: string;
}

export class UserResModel extends UserDto{
   static createResponse(auth: IAuth, user: IUser): UserResModel {
      return {
         id: user._id.toString(),
         email: auth.email,
         username: user.username,
         fullName: user.fullName,
      }
   }
}