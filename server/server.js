const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://user01:xEjCs116TyQayIet@clear-fashion.hiw8bir.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clear-fashion';
const MONGODB_DB_COLLECTION = 'products';
const data = require('./sandbox.js');

// Create a new MongoClient
const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
let result = [];


//sandbox.js is returning an array of objects with all the products i want to insert into the database


async function scrape(){
    result = await data.getProduct();
    console.log('yes');
}


/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
async function getProducts(page = 1, limit = 12, brand = null, price = null, sort = null) {
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection(MONGODB_DB_COLLECTION);

    let query = {};

    if (brand) {
      query.brand = brand;
    }

    if (price) {
      query.price = { $lt: price };
    }

    let sortQuery = {};

    if (sort) {
      if (sort === 'asc') {
        sortQuery.price = 1;
      } else if (sort === 'desc') {
        sortQuery.price = -1;
      }
    }

    let products = await collection.find(query).sort(sortQuery).toArray();

    const total = products.length;
    const pages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    products = products.slice(offset, offset + limit);

    return { result: products, meta: { total, pages, page, limit } };
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

async function insertProducts() {
    try {
      await client.connect();
      const db = client.db(MONGODB_DB_NAME);
      const collection = db.collection(MONGODB_DB_COLLECTION);
      const result = await data.getProduct();
      if (result.length > 0) {
        await collection.insertMany(result);
        console.log(`Inserted ${result.length} products into ${MONGODB_DB_COLLECTION}`);
      } else {
        console.log("No products found to insert.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      await client.close();
    }
  }
  
module.exports = {insertProducts, getProducts, scrape};









