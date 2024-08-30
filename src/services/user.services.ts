import { UserModel } from "../models/User";
import { LoginDto, SignUpDto, UserResModel } from "../dtos/user.dto";
import { Auth, AuthRoles } from "../models/Auth";
import { hasher } from "../utils/bcrypt";
import { CONFIG } from "../utils/config";
import { signJwt } from "../utils/jwt";

export class UserServies {
   public async createUser(userDto: SignUpDto) {
      if (userDto.role === AuthRoles.ADMIN) {
         return {
            status: 401,
            message: 'You cannot perform this action.'
         }
      }

      const email = userDto.email.toLowerCase();
      const auth = await Auth.findOne({ email: email });
      if (auth) {
         return {
            status: 400,
            message: 'User account already exists.'
         }
      }

      const user = await UserModel.findOne({ username: userDto.username });
      if (user) {
         return {
            status: 400,
            message: 'Username hss been taken.'
         }
      }

      const hashedPassword = await hasher.hashPasswordHandler(userDto.password);

      const newAuth = await Auth.create({
         email: email,
         password: hashedPassword,
         role: userDto.role,
      });

      await UserModel.create({
         userId: newAuth._id,
         username: userDto.username,
         firstName: userDto.firstName,
         lastName: userDto.lastName,
      });


      return {
         status: 200,
         message: 'User account has been created successfully. Proceed to login.',
      }
   }

   public async loginUser(userDto: LoginDto) {
      const email = userDto.email.toLowerCase();
      const auth = await Auth.findOne({ email: email }).select('password email');
      if (!auth) {
         return {
            status: 404,
            message: 'User account does not exist.'
         }
      }

      const isValid = await hasher.comparePassword(userDto.password, auth.password);
      if (!isValid) {
         return {
            status: 400,
            message: 'Wrong password.'
         }
      }

      const user = await UserModel.findOne({ userId: auth.id });
      if (!user) {
         return {
            status: 404,
            message: 'User not found.'
         }
      }

      const payload = {
         id: auth.id,
         email: auth.email,
      };
      const token = signJwt(payload, CONFIG.JwtAuthExpiration);
      const response = UserResModel.createResponse(auth, user);

      return {
         status: 200,
         message: 'User login successfully.',
         data: {
            token,
            response
         }
      }
   }

   // public async getUser() {
   //    const users = await UserModel.find();


   //    return {
   //       status: 200,
   //       message: 'Blogs have been fetched successfully.',
   //       data: {
   //          users
   //       }
   //    }
   // }
}