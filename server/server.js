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
  
module.exports = { scrape};









