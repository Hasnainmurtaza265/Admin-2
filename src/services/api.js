
const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "https://shop-cobackend.vercel.app"
).replace(/\/+$/, "");

const API_URL = API_BASE.endsWith("/api")
  ? API_BASE
  : `${API_BASE}/api`;

export function getToken() {
  return localStorage.getItem("shopco_admin_token");
}

export function setToken(token) {
  if (token) {
    localStorage.setItem("shopco_admin_token", token);
  } else {
    localStorage.removeItem("shopco_admin_token");
  }
}

export async function api(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      mode: "cors",
    });
  } catch (error) {
    console.error("Shop.Co API connection error:", error);
    console.error("API URL:", `${API_URL}${path}`);

    throw new Error(
      "Backend connection failed. Check API URL and backend CORS settings."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && path !== "/auth/admin/login") {
      setToken(null);
    }

    throw new Error(
      data.message || `API Error: ${response.status}`
    );
  }

  return data;
}

export const shopApi = {
  // Authentication
  login: (email, password) =>
    api("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => api("/auth/me"),

  // Dashboard
  adminStats: () => api("/admin/stats"),

  customers: () => api("/admin/customers"),

  // Products
  products: () => api("/products?limit=100"),

  createProduct: (product) =>
    api("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  updateProduct: (id, product) =>
    api(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),

  deleteProduct: (id) =>
    api(`/products/${id}`, {
      method: "DELETE",
    }),

  // Orders
  orders: () => api("/orders"),

  updateOrderStatus: (id, status) =>
    api(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
