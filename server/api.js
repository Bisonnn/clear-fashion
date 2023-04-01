const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./server.js');

const PORT = process.env.PORT || 8092;
const SERVER_TIMEOUT = 120000; // set server timeout to 2 minutes

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

//create an asyncy function to get products from the mongodb database it takes the page and the limit as parameters
app.get('/products/', async (request, response) => {
  try {
    const page = parseInt(request.query.page)
    const limit = parseInt(request.query.limit)
    const price = parseInt(request.query.price)
    const brand = request.query.brand
    const sort = request.query.sort

    // set the timeout option to 2 minutes
    const products = await db.getProducts(page, limit, brand, price, sort, { timeout: 120000 });
    response.send(products);
  } catch (error) {
    console.error(error);
  }
});

// set the server timeout to 2 minutes
const server = app.listen(PORT, () => {
  console.log(`📡 Running on port ${PORT}`);
});

server.setTimeout(SERVER_TIMEOUT);
