const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./server.js');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

//create an asyncy function tp get productucts from the mongodb database it takes the page and the limit as parameters
app.get('/products/', async (request, response) => {
  try {
    const page = parseInt(request.query.page)
    const limit = parseInt(request.query.limit)
    const price = parseInt(request.query.price)
    const brand = request.query.brand
    const sort = request.query.sort

    const products = await db.getProducts(page, limit, brand, price, sort);
    response.send(products);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
