const mongoose = require("mongoose")

const CustomerSupportShema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 20,
        required: [true, 'Name is required!'],
    },
    email: {
        type: String,
        unique: [true, 'Email must be unique'],
        required: [true, 'Email is required'],
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    message: {
        type: String,
        minLength: 40,
        maxLength: 600,
        required: [true, 'Message is required!'],
    }
},
{
    timestamps: true, 
});

const CustomerSupport = mongoose.model('CustomerSupport', CustomerSupportShema, 'customersSupport');

module.exports = CustomerSupport;