const mongoose = require('mongoose');

const ProductsShema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    types: {
        type: String,
        required: true
    },
    short_description: {
        type: String,
        required: true
    },
    long_description: {
        type: String,
        required: true
    },
    olfactory_note: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    can_in_ml: {
        type: Number,
        required: true
    },
    can_in_g: {
        type: Number,
        required: true
    },
    meterial: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const Products = mongoose.model('Products', ProductsShema);
module.exports = Products;
