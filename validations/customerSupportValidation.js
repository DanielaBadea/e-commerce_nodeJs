const Joi = require('joi');

 const customerSupportSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.min': 'Name should have a minimum length of {#limit}',
        'string.max': 'Name should have a maximum length of {#limit}',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    message: Joi.string().min(40).max(600).required().messages({
        'string.min': 'Message should have a minimum length of {#limit}',
        'string.max': 'Message should have a maximum length of {#limit}',
        'any.required': 'Message is required'
    })
});

const validateCustomerSupport = (user) => {
    return customerSupportSchema.validate(user, { abortEarly: false });
};

module.exports = validateCustomerSupport;
