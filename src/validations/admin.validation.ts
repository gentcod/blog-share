import Joi from "joi";

export const BlogIdValidation = Joi.object({
   blogIds: Joi.array().items(
      Joi.string().min(1).trim().required(),
   )
});