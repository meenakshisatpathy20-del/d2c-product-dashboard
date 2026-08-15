const BASE_URL = 'https://dummyjson.com/products';

export const fetchProducts = async ({ limit = 8, skip = 0, search = '', category = '', sortBy = '', order = 'asc' }) => {
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
  if (!response.ok) throw new Error('Network error');
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/category-list`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(`${BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};