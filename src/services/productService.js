const BASE_URL = 'https://dummyjson.com/products';

export const getProducts = async ({ limit = 8, skip = 0, search = '', category = '', sortBy = '', order = 'asc' }) => {
  let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;
  
  if (search) {
    url = `${BASE_URL}/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
  } else if (category) {
    url = `${BASE_URL}/category/${category}?limit=${limit}&skip=${skip}`;
  }

  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch catalog from server');
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/category-list`);
  if (!response.ok) throw new Error('Failed to fetch category taxonomy');
  return response.json();
};

export const addProduct = async (productData) => {
  const response = await fetch(`${BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to create product listing');
  return response.json();
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to update product details');
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delist product');
  return response.json();
};

export const bulkUpdate = async (ids, changes) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, updatedCount: ids.length, changes });
    }, 400);
  });
};