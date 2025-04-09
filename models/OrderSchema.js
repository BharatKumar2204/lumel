const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    products: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      shippingCost: { type: Number, required: true },
    }],
    paymentMethod: { type: String },
    dateOfSale: { type: Date, required: true },
});
  
module.exports = mongoose.model('Order', orderSchema);