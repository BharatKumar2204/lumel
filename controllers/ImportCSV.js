const fs = require('fs');
const csv = require('csv-parser');

const Customer = require('../models/CustomerSchema');
const Product = require('../models/ProductSchema');
const Order = require('../models/OrderSchema');
const logger = require('../utils/Logger');


function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

exports.importCSV = async (req, res) => {
  const results = [];
  const errors = [];

  try {
    fs.createReadStream('data.csv')
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', async () => {
        for (const row of results) {
          try {
            const customer = await Customer.findOneAndUpdate(
              { customerId: row['Customer ID'] },
              {
                customerId: row['Customer ID'],
                name: row['Customer Name'],
                email: row['Customer Email'],
                address: row['Customer Address'],
                region: row['Region'],
              },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            const product = await Product.findOneAndUpdate(
              { productId: row['Product ID'] },
              {
                productId: row['Product ID'],
                name: row['Product Name'],
                category: row['Category'],
                basePrice: parseFloat(row['Unit Price']),
                discount: parseFloat(row['Discount']),
                description: '',
                brand: '',
                specifications: {},
              },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            await Order.findOneAndUpdate(
              { orderId: row['Order ID'] },
              {
                orderId: row['Order ID'],
                customer: customer._id,
                products: [{
                  product: product._id,
                  quantity: parseInt(row['Quantity Sold']),
                  unitPrice: parseFloat(row['Unit Price']),
                  discount: parseFloat(row['Discount']),
                  shippingCost: parseFloat(row['Shipping Cost']),
                }],
                paymentMethod: row['Payment Method'],
                dateOfSale: parseDate(row['Date of Sale']),
              },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            logger.info(`Successfully processed Order ID: ${row['Order ID']}`);
          } catch (err) {
            const errorMessage = `Error processing Order ID ${row['Order ID']}: ${err.message}`;
            errors.push(errorMessage);
            logger.error(errorMessage);
          }
        }

        logger.info(`Finished processing ${results.length} rows`);

        if (errors.length > 0) {
          return res.status(207).json({
            message: `Processed ${results.length} rows with some errors`,
            errors,
          });
        }

        return res.status(200).json({
          message: `Successfully processed all ${results.length} rows`,
        });
      })
      .on('error', (err) => {
        logger.error('Failed to read CSV:', err.message);
        return res.status(500).json({ message: 'Failed to read CSV file', error: err.message });
      });
  } catch (err) {
    logger.error('Unexpected error during import:', err.message);
    return res.status(500).json({ message: 'Unexpected error during import', error: err.message });
  }
};

