import Joi from "joi";

export const SignUpValidation = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).trim().required(),
  password: Joi.string().required().min(8).pattern(/^\S+$/).trim(),
  username: Joi.string().trim().required(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  role: Joi.string().trim().valid('user', 'employee').required(),
});

export const LoginValidation = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).trim().required(),
  password: Joi.string().required().min(8).pattern(/^\S+$/).trim(),
});