const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.min': `{{#label}} should have a minimum length of {#limit}`,
        'string.max': `{{#label}} should have a maximum length of {#limit}`,
        'any.required': `{{#label}} is required`
    }),
    email: Joi.string().email().required().messages({
        'string.email': `{{#label}} must be followed by a '.' domain suffix. For example, adrian@gmail.com`,
        'any.required': `{{#label}} is required`,
    }),
    password: Joi.string().min(6).max(60).required().messages({
        'string.min': `{{#label}} should have a minimum length of {#limit}`,
        'string.max': `{{#label}} should have a maximum length of {#limit}`,
        'any.required': `{{#label}} is required`
    }),
    repeat_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',  
        'any.required': `{{#label}} is required`
    }),
    role: Joi.string().valid('user', 'admin').messages({
        'string.base': `{{#label}} should be a type of string`,
        'string.empty': `{{#label}} must contain value`,
        'any.required': `missing field {{#label}}`,
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': `{{#label}} must be followed by a '.' domain suffix. For example, adrian@gmail.com`,
        'any.required': `{{#label}} is required`,
    }),
    password: Joi.string().min(6).max(60).required().messages({
        'string.min': `{{#label}} should have a minimum length of {#limit}`,
        'string.max': `{{#label}} should have a maximum length of {#limit}`,
        'any.required': `{{#label}} is required`
    }),
});


const validateRegistration = (user) => {
    return registerSchema.validate(user, { abortEarly: false }); 
};

const validateLogin = (user) => {
    return loginSchema.validate(user, { abortEarly: false }); 
};

module.exports = { validateRegistration, validateLogin };
