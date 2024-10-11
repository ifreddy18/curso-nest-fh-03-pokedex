// import Joi from 'joi' //-> No funciona
import * as Joi from 'joi' //-> Si funciona

export const JoiValidationSchema = Joi.object({
	MONGODB: Joi.required(),
	PORT: Joi.number().default(3000),
	DEFAULT_LIMIT: Joi.number().default(5),
})
