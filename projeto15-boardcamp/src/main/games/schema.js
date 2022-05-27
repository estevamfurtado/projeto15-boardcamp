import Joi from "joi";


export const GameSchema = Joi.object({
    name: Joi.string().required().messages({
        "name": "Not a valid game name",
    }),
    image: Joi.string().uri().required().messages({
        "image": "Not a valid email format",
    }),
    stockTotal: Joi.number().integer().min(1).required().messages({
        "stockTotal": "Email is required",
    }),
    categoryId: Joi.number().required().messages({
        "categoryId": "Email is required",
    }),
    pricePerDay: Joi.number().integer().min(1).required().messages({
        "pricePerDay": "Not a valid email format",
    })
});