import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get stored auth token
 */
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Make API request with auth token
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Transaction API Methods
 */
export const transactionAPI = {
  getAll: async () => {
    return apiRequest('/transactions', {
      method: 'GET',
    });
  },

  create: async (transactionData) => {
    return apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        ...transactionData,
        type: transactionData.type === 'debit' ? 'EXPENSE' : 'INCOME',
      }),
    });
  },

  update: async (transactionId, transactionData) => {
    return apiRequest(`/transactions/${transactionId}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
  },

  delete: async (transactionId) => {
    return apiRequest(`/transactions/${transactionId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * User API Methods
 */
export const userAPI = {
  login: async (email, password) => {
    return apiRequest('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name, email, password) => {
    return apiRequest('/user/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  getProfile: async () => {
    return apiRequest('/user/profile', {
      method: 'GET',
    });
  },
};

export default {
  transactionAPI,
  userAPI,
};
