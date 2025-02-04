import Joi from "joi";

export const validateUser = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        age: Joi.number().min(18).required(),
        phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
        role: Joi.string().valid('Player', 'Organizer').required(),
        salary: Joi.number().min(1000).required(),
    });

    return schema.validate(data);  
};