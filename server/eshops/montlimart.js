// scrap product data from montlimart.com

// Path: server\eshops\montlimart.js
// Compare this snippet from server\eshops\dedicatedbrand.js:
const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 **/
const parse = data => {
    const $ = cheerio.load(data);
    
    return $('.product-miniature')
        .map((i, element) => {
        const brand = 'Montlimart';
        const name = $(element)
            .find('.product-miniature__title')
            .text()
            .trim()
            .replace(/\s/g, ' ');
        const link = $(element)
            .find('.product-miniature__title a') // find the link
            .attr('href'); // get the href attribute
        const price = parseInt(
            $(element)
            .find('.product-miniature__pricing')
            .text()
        );
        const image = $(element)
            .find('.product-miniature__thumb-link img')
            .attr('data-src');
        return {brand, name, link, price, image};
        })
        .get();
    }

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 * */
module.exports.scrape = async url => {
    try{
        const response = await fetch(url);
        
        if(response.ok){
            const body = await response.text();
            
            return parse(body);
        }
        
        console.error(response);
        
        return null;
    }catch(error){
        console.error(error);
        return null;

    }
}

