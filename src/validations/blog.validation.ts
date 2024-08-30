import Joi from "joi";

export const BlogValidation = Joi.object({
  title: Joi.string().required().trim().min(8),
  post: Joi.string().required().trim().min(50),
});

export const BlogUpdateValidation = Joi.object({
  title: Joi.string().trim().min(8),
  post: Joi.string().trim().min(50),
});