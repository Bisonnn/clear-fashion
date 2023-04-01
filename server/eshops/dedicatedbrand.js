const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const brand = 'DedicatedBrand';
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const templink = $(element)
        .find('.productList-link') // find the link
        .attr('href'); // get the href attribute
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      )
      const image = $(element)
        .find('.productList-image img')
        .attr('data-src');
    const link = "https://www.dedicatedbrand.com" + templink;
      return {brand, name, link, price, image};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
