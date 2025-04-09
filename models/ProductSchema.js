const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    basePrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    description: { type: String },
    brand: { type: String },
    specifications: { type: Object },
});
  
module.exports = mongoose.model('Product', productSchema);