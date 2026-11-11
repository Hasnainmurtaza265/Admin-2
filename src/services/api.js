const API_URL = (import.meta.env.VITE_API_URL || 'https://shop-cobackend.vercel.app/api').replace(/\/$/, '');

export function getToken() {
  return localStorage.getItem('shopco_admin_token');
}
export function setToken(token) {
  if (token) localStorage.setItem('shopco_admin_token', token);
  else localStorage.removeItem('shopco_admin_token');
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('Backend se connection nahi ho saka. API URL aur CORS settings check karein.');
  }
  const body = response.status === 204 ? {} : await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && path !== '/auth/login') setToken(null);
    throw new Error(body.message || `Request failed (${response.status})`);
  }
  return body;
}

export const shopApi = {
  login: (email, password) => api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => api('/auth/me'),
  products: () => api('/products?limit=100'),
  createProduct: (product) => api('/products', { method: 'POST', body: JSON.stringify(product) }),
  updateProduct: (id, product) => api(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
  deleteProduct: (id) => api(`/products/${id}`, { method: 'DELETE' }),
  orders: () => api('/orders'),
  updateOrderStatus: (id, status) => api(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
