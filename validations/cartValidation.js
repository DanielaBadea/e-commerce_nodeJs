const Joi = require('joi');
const joiObjectid = require('joi-objectid');
// const mongoose = require('mongoose');
const JoiObjectId = require('joi-objectid')(Joi);

// const objectId = () => Joi.string().custom((value, helpers) => {
//     if (!mongoose.Types.ObjectId.isValid(value)) {
//         return helpers.message(`"${value}" is not a valid ObjectId`);
//     }
//     return value;
// }, 'ObjectId Validation');

const itemSchema = Joi.object({
    productId: JoiObjectId().required(),
    title: Joi.string().required(),
    brand: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().integer().min(1).required(),
});

const cartSchema = Joi.object({
    userId: JoiObjectId(),
    items: Joi.array().items(itemSchema).min(1).required(),
    totalQuantity: Joi.number().integer().min(0),
    totalAmount: Joi.number().min(0),
});

const validateCart = (cart) => cartSchema.validate(cart);

module.exports = validateCart;
