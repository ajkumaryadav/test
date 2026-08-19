// Lightweight API client helper

const API_BASE = '/api/auth';

export const getAuthToken = () => localStorage.getItem('auth_token');
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const api = {
  // Login with email and password
  async login(email, password) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed. Please check your credentials.');
    }
    return data;
  },

  // Register a new user
  async register(name, email, password) {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed. Please check the information provided.');
    }
    return data;
  },

  // Get current user profile
  async getCurrentUser() {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        setAuthToken(null);
      }
      return null;
    }

    const data = await response.json();
    return data.user;
  },

  // Health check for backend & DB connection
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return await response.json();
    } catch (error) {
      return { status: 'offline', error: error.message };
    }
  },
};
