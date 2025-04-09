const express = require('express');
const connectDB = require('./config/Database');

const dotenv = require('dotenv');
const import_data=require('./routes/ImportRoutes');
const topProducts=require('./routes/TopProducts');

const app = express();
const port = 3000;

dotenv.config();
connectDB();
app.get('/', (req, res) => {
  res.send('Lumel Coding Assessment');
});

app.use('/api', import_data);
app.use('/api', topProducts);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
