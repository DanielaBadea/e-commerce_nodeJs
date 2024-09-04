const express = require('express')
const router = express.Router();
const CustomerSupport = require('../models/CustomerSupport');
const validateCustomerSupport = require('../middlewares/customerValidation');
const auth = require('../middlewares/auth');

router.post('/customer-support', auth, validateCustomerSupport, async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const existingMessage = await CustomerSupport.findOne({ email });
        if (existingMessage) {
            return res.status(400).json({ message: 'A message with this email already exists.' });
        };

        const newMessage = new CustomerSupport({
            name,
            email,
            message,
        });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully!', newMessage });
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;