/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimar = require('./eshops/montlimart.js');
const circlesports = require('./eshops/circlesportswear.js');

const fs = require('fs');

console.log(process.argv);

async function dedicatedbrandScrap (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await dedicatedbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }


}

async function montlimarScrap (eshop = 'https://www.montlimart.com/99-vetements'){
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await montlimar.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function circlesportsScrap (eshop = 'https://shop.circlesportswear.com/collections/collection-homme'){
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await circlesports.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;
circlesportsScrap(eshop);
//circlesportsScrap(eshop);
/*switch (true) {
  case eshop.includes('dedicatedbrand'):
    dedicatedbrandScrap(eshop);
    break;
  case eshop.includes('montlimart'):
    montlimarScrap(eshop);
    break;
  case eshop.includes('circlesportswear'):
    circlesportsScrap(eshop);
  default:
    console.log('no eshop found');
    process.exit(1);
}*/





