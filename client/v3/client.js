// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/
Search for specific products
This endpoint accepts the following optional query string parameters:
- `page` - page of products to return
- `size` - number of products to return
GET https://clear-fashion-api.vercel.app/brands
Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbRecentProducts');
const spanNbBrands = document.querySelector('#nbBrands');
const inputBrandFilter = document.querySelector('#brand-filter');
const selectSort = document.querySelector('#sort-select');

const percentile50 = document.querySelector('#medianPrice');
const percentile90 = document.querySelector('#percentilePrice90');
const percentile95 = document.querySelector('#percentilePrice95');
const lastUpdate = document.querySelector('#lastUpdate');


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};


/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @param  {String}  [brand] - brand name to filter by
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand) => {
  try {
    let url = `https://clear-fashion-bisonnn.vercel.app/products?page=${page}&limit=${size}`;
    if (brand) {
      url += `&brand=${brand}`;
    }
    const response = await fetch(url);
    const body = await response.json();
    return body;

  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 * @param  {String} sortOption
 */
const renderProducts = (sortedProducts) => {
  // Sort products by given sort option

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // create table header
  const headerRow = document.createElement('tr');
  const headers = ['Brand', 'Name', 'Price'];

  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.appendChild(document.createTextNode(headerText));
    headerRow.appendChild(header);
  });

  thead.appendChild(headerRow);

  // create table rows for each product
  sortedProducts.forEach(product => {
    const productRow = document.createElement('tr');

    const brand = document.createElement('td');
    brand.appendChild(document.createTextNode(product.brand));
    productRow.appendChild(brand);

    const name = document.createElement('td');
    const link = document.createElement('a');
    link.setAttribute('href', product.link);
    link.setAttribute('target', '_blank'); // open link in new tab
    link.appendChild(document.createTextNode(product.name));
    name.appendChild(link);
    productRow.appendChild(name);

    const price = document.createElement('td');
    price.appendChild(document.createTextNode(product.price));
    productRow.appendChild(price);
    
    tbody.appendChild(productRow);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(table);
};




/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {page, limit} = pagination;
  const options = Array.from(
    {'length': limit},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {

  //count product on page
  const count = currentProducts.length;
  const newProducts = countNewProducts(currentProducts);
  const brandCount = countBrands(currentProducts);

  spanNbProducts.innerHTML = count;
  spanNbNewProducts.innerHTML = newProducts;
  spanNbBrands.innerHTML = brandCount;
  percentile50.innerHTML = percentile(currentProducts, 0.5);
  percentile90.innerHTML = percentile(currentProducts, 0.9);
  percentile95.innerHTML = percentile(currentProducts, 0.95);
  lastUpdate.innerHTML = mostRecentDate(currentProducts);
};


const render = (products, pagination, sortOption) => {
  const sortedProducts = sortProducts(products, sortOption);
  renderProducts(sortedProducts);
  renderPagination(pagination);
  renderIndicators(pagination);
};


//sort filter
/*
 * Sort products by given sort option
 * @param  {Array} products
 * @param  {String} sortOption
 * @return {Array}
 */
const sortProducts = (products, sortOption) => {
  switch(sortOption) {
    case 'price-asc':
      return products.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return products.sort((a, b) => b.price - a.price);
    default:
      return products;
  }
};

//count of new products
const countNewProducts = (products) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 3);
  return products.filter(product => new Date(product.released) > sixMonthsAgo).length;
}

//count of brands
const countBrands = (products) => {
  const brands = new Set(products.map(product => product.brand));
  return brands.size;
}

//Percentile on products price on continous series 

const percentile = (products, percentile) => {
  const prices = products.map(product => product.price);
  prices.sort((a, b) => a - b);
  const index = (prices.length - 1) * percentile;
  const result = Math.floor(index);
  return prices[result];
}

//Show the most recent date of release on all products
const mostRecentDate = (products) => {
  const dates = products.map(product => new Date(product.released));
  dates.sort((a, b) => b - a);
  return dates[0];
}


/**
 * Declaration of all Listeners
*/ 

inputBrandFilter.addEventListener('input', async (event) => {
  const brand = event.target.value;

  // fetch products with brand filter
  const products = await fetchProducts(currentPagination.currentPage, selectShow.value, brand);

  setCurrentProducts(products);
  render(currentProducts, currentPagination, selectSort.value);
});

selectShow.addEventListener('change', async (event) => {
  const size = event.target.value;

  const products = await fetchProducts(currentPagination.currentPage, size, null, selectSort.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination, selectSort.value);
});

selectSort.addEventListener('change', async (event) => {
  const sortOption = event.target.value;

  const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, null, sortOption);

  setCurrentProducts(products);
  render(currentProducts, currentPagination,selectSort.value);
});

selectPage.addEventListener('change', async (event) => {
  const page = event.target.value;

  const products = await fetchProducts(page, currentPagination.pageSize, null, selectSort.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination, selectSort.value);
});

document.addEventListener('DOMContentLoaded', async () => {
  
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination, selectSort.value);
});
