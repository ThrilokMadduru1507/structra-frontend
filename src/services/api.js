const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-production-a5689.up.railway.app';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return data.data;
  },
  register: async (name, email, password, role) => {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    return data.data;
  },
  getCurrentUser: async () => {
    const data = await apiRequest('/api/auth/me');
    return data.data.user;
  },
};

// Hierarchy API
export const hierarchyAPI = {
  getAllClients: async () => {
    const data = await apiRequest('/api/hierarchy/clients');
    return data.data;
  },
  getClientHierarchy: async (clientId) => {
    const data = await apiRequest(`/api/hierarchy/clients/${clientId}`);
    return data.data;
  },
};

// Client API
export const clientAPI = {
  getAll: async () => {
    const data = await apiRequest('/api/clients');
    return data.data;
  },
  getById: async (id) => {
    const data = await apiRequest(`/api/clients/${id}`);
    return data.data;
  },
  create: async (clientData) => {
    const data = await apiRequest('/api/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
    return data.data;
  },
  update: async (id, clientData) => {
    const data = await apiRequest(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
    return data.data;
  },
  delete: async (id) => {
    const data = await apiRequest(`/api/clients/${id}`, {
      method: 'DELETE',
    });
    return data;
  },
};

// Diagram API
export const diagramAPI = {
  getByFunction: async (functionId) => {
    const data = await apiRequest(`/api/diagrams/function/${functionId}`);
    return data.data;
  },
  getById: async (id) => {
    const data = await apiRequest(`/api/diagrams/${id}`);
    return data.data;
  },
  create: async (functionId, diagramData) => {
    const data = await apiRequest(`/api/diagrams/function/${functionId}`, {
      method: 'POST',
      body: JSON.stringify(diagramData),
    });
    return data.data;
  },
  update: async (id, diagramData) => {
    const data = await apiRequest(`/api/diagrams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(diagramData),
    });
    return data.data;
  },
  delete: async (id) => {
    const data = await apiRequest(`/api/diagrams/${id}`, {
      method: 'DELETE',
    });
    return data;
  },
  saveContent: async (id, nodes, edges) => {
    const data = await apiRequest(`/api/diagrams/${id}/content`, {
      method: 'POST',
      body: JSON.stringify({ nodes, edges }),
    });
    return data.data;
  },
};

export default {
  auth: authAPI,
  hierarchy: hierarchyAPI,
  clients: clientAPI,
  diagrams: diagramAPI,
};
