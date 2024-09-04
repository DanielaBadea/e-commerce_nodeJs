
const {validateRegistration, validateLogin } = require("../validations/usersValidation")

const validateRegistrationMidd = (req, res, next) => {
    const { error } = validateRegistration(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    };
    next();
};

const validateLoginMidd = (req, res, next) => {
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    };
    next();
};

// const validateRegistrationMidd = (req, res, next) => {
//     const { error } = validateRegistration(req.body);
//     if (error) {
//         // Returnează toate erorile în loc de doar primul mesaj de eroare
//         const errors = error.details.map(err => ({
//             message: err.message,
//             field: err.context.label
//         }));
//         return res.status(400).json({ errors });
//     }
//     next();
// };

// const validateLoginMidd = (req, res, next) => {
//     const { error } = validateLogin(req.body);
//     if (error) {
//         const errors = error.details.map(err => ({
//             message: err.message,
//             field: err.context.label
//         }));
//         return res.status(400).json({ errors });
//     }
//     next();
// };

module.exports = { validateRegistrationMidd, validateLoginMidd };