const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const ProductModel = mongoose.model('Product', ProductSchema); // collection name => products
module.exports = ProductModel;
