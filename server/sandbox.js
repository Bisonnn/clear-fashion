/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimar = require('./eshops/montlimart.js');
const circlesports = require('./eshops/circlesportswear.js');

const fs = require('fs');
const { type } = require('os');
const allProducts = [];

console.log(process.argv);

async function dedicatedbrandScrap (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await dedicatedbrand.scrape(eshop);
    allProducts.push(products);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }


}

async function montlimarScrap (eshop = 'https://www.montlimart.com/99-vetements'){
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await montlimar.scrape(eshop);
    allProducts.push(products);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function circlesportsScrap (eshop = 'https://shop.circlesportswear.com/collections/all'){
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
    const products = await circlesports.scrape(eshop);
    allProducts.push(products);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

//MAIN FUNCTION that scrrapp all product and put it into allProducts arrayù
const getProduct = async () => {
  await dedicatedbrandScrap();
  await montlimarScrap();
  await circlesportsScrap();
  //delete sub array in allProducts to have only one array
  //modify the array to be an array of object
  return allProducts.flat();
}


module.exports = { getProduct };









