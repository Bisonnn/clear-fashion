const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 * */

const parse = data => {
    const $ = cheerio.load(data);
    
    //I want to scrap the product name and price on circlesportswear.com
   
    return $('.product-grid .grid__item')
        .map((i, element) => {
        const brand = 'CircleSportswear';
        const name = $(element)
            .find('.card__heading.h5 a')
            .text()
            .trim()
            .replace(/\s/g, ' ');
        const templink = $(element)
            .find('.card__heading.h5 a') // find the link
            .attr('href'); // get the href attribute
        const price = parseInt(
            $(element)
            .find('.price-item--regular .money')
            .text()
            .replace(/\D/g, '')
        );
        const tempImage = $(element)
            .find('.card__media img')
            .attr('src');
        image = "https:" + tempImage;
    const link = "https://shop.circlesportswear.com/" + templink;
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
