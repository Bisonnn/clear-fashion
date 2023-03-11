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
const p50 = document.querySelector('#medianPrice');
const p90 = document.querySelector('#percentilePrice90');
const p95 = document.querySelector('#percentilePrice95');


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
    let url = `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`;
    if (brand) {
      url += `&brand=${brand}`;
    }
    const response = await fetch(url);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
        <span>${product.released}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

//update pages

const updatePage = async () => {
  const page = selectPage.selectedIndex + 1;
  const size = selectShow.value;
  const {result, meta} = await fetchProducts(page, size);
  setCurrentProducts({result, meta});
  render(currentProducts, currentPagination);
};

//brand filter 

const brandFilterInput = document.querySelector('#brand-filter');
brandFilterInput.addEventListener('input', event => {
  const filterValue = event.target.value.trim().toLowerCase();
  const filteredProducts = currentProducts.filter(product =>
    product.brand.toLowerCase().includes(filterValue)
  );
  setCurrentProducts({result: filteredProducts, meta: currentPagination});
  render(currentProducts, currentPagination);
});

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
  const newProducts = countNewProducts(currentProducts);
  const brandCount = countBrands(currentProducts);

  spanNbProducts.innerHTML = count;
  spanNbNewProducts.innerHTML = newProducts;
  spanNbBrands.innerHTML = brandCount;
  p50.innerHTML = percentile(currentProducts, 50);
  p90.innerHTML = percentile(currentProducts, 90);
  p95.innerHTML = percentile(currentProducts, 95);
};


const render = (products, pagination, sortOption) => {
  const sortedProducts = sortProducts(products, sortOption);
  renderProducts(sortedProducts);
  renderPagination(pagination);
  renderIndicators(pagination);
};

//sort filter
const sortProducts = (products, sortOption) => {
  switch(sortOption) {
    case "price-asc":
      return products.sort((a, b) => a.price - b.price);
    case "price-desc":
      return products.sort((a, b) => b.price - a.price);
    case "date-desc":
      return products.sort((a, b) => new Date(b.released) - new Date(a.released));
    case "date-asc":
      return products.sort((a, b) => new Date(a.released) - new Date(b.released));
    default:
      return products;
  }
};

//count of new products
const countNewProducts = (products) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return products.filter(product => new Date(product.released) > sixMonthsAgo).length;
}

//count of brands
const countBrands = (products) => {
  const brands = new Set(products.map(product => product.brand));
  return brands.size;
}

//Percentile on products price series 

function percentile(arr, k) {
  const prices = products.map(arr => arr.price);
  prices.sort(function(a, b) { return a - b; });
  var index = Math.ceil(k / 100 * price.length) - 1;
  return arr[index];
}




/**
 * Declaration of all Listeners
 */

inputBrandFilter.addEventListener('input', async (event) => {
  const brand = event.target.value;

  // fetch products with brand filter
  const products = await fetchProducts(currentPagination.currentPage, selectShow.value, brand);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Select the number of products to display
 */
selectPage.addEventListener("change", updatePage);

selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectSort.addEventListener('change', event => {
  const sortOption = event.target.value;
  render(currentProducts, currentPagination, sortOption);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
