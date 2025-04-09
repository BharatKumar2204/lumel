const Order = require('../models/OrderSchema');


exports.topProducts = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'overall', limit = 5 } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const orders = await Order.find({
      dateOfSale: { $gte: start, $lte: end }
    }).populate('products.product').populate('customer');

    const productMap = {};

    for (const order of orders) {
      for (const item of order.products) {
        const product = item.product;
        const category = product.category;
        const region = order.customer.region;
        const key =
          groupBy === 'category'
            ? `${product._id}_${category}`
            : groupBy === 'region'
            ? `${product._id}_${region}`
            : `${product._id}`;

        if (!productMap[key]) {
          productMap[key] = {
            productId: product.productId,
            name: product.name,
            quantity: 0,
            category,
            region,
          };
        }

        productMap[key].quantity += item.quantity;
      }
    }

    // Convert to array and sort
    let topProducts = Object.values(productMap).sort((a, b) => b.quantity - a.quantity);

    // Limit to top N
    topProducts = topProducts.slice(0, parseInt(limit));

    res.json({ topProducts });
  } catch (err) {
    console.error('Top products error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


