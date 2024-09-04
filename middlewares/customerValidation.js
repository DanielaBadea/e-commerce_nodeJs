const validateCustomerSupport = require('../validations/customerSupportValidation');

const validateCustomerSupportMidd= (req, res, next) => {
    const { error } = validateCustomerSupport(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    };
    next();
};

module.exports = validateCustomerSupportMidd;