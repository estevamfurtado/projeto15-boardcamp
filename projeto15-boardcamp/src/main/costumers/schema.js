import Joi from "joi";

export const CostumerSchema = Joi.object({
    name: Joi.string().required().messages({
        "name": "Not a valid name",
    }),
    phone: Joi.string().min(10).max(11).pattern(/^[0-9]+$/).required().messages({
        "phone": "Not a valid phone",
    }),
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required().messages({
        "cpf": "Not a valid cpf",
    }),
    birthday: Joi.date().required().messages({
        "birthday": "Not a valid birthday",
    })
});