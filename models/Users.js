const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 20,
        required: [true, 'Name is required for contact'],
    },
    email: {
        type: String,
        unique: [true, 'Email must be unique'],
        required: [true, 'Email is required'],
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        minLength: 6,
        maxLength: 60, 
        required: [true, 'Password is required'],
    },
    // repeat_password: {
    //     type: String,
    //     minLength: 6,
    //     maxLength: 60, 
    //     required: [true, 'Repeat password is required'],
    //     validate: {
    //         validator: function(value) {
    //             return value === this.password;
    //         },
    //         message: 'Passwords do not match',
    //     },
    // },
    token: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, { timestamps: true });

// Hashui parola inainte de a o salva in doc 
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 10);
    }
    // Sterg repeat_password inante de a o salva
    // this.repeat_password = undefined;
    next();
});

userSchema.methods.isValidPassword = async function(password) {
    return await bcryptjs.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
