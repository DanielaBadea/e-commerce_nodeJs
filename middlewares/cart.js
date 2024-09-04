const validateCart = require('../validations/cartValidation');

// Middleware pentru validarea articolelor din coș
// const validateCartItemMidd = (req, res, next) => {
//     const { error } = validateCartItem(req.body);
//     if (error) {
//         return res.status(400).json({ message: error.details[0].message });
//     }
//     next();
// };

// Middleware pentru validarea întregului coș
const validateCartMidd = (req, res, next) => {
    const { error } = validateCart(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateCartMidd;
