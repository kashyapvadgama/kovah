import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- IMPORTANT ---
// Replace this with your computer's local Wi-Fi IP address.
// This is the MOST LIKELY cause of the network error.
const YOUR_COMPUTER_IP = '172.20.10.9'; // <--- CHANGE THIS
// ---------------

// This setup automatically detects the correct IP for different environments.
const API_URL = `http://${YOUR_COMPUTER_IP}:3001`;

const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('userToken');

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An API error occurred');
    }
    return data;
  } catch (error) {
    console.error(`API Client Error (${endpoint}):`, error);
    // Re-throw the error so the component can handle it
    throw error;
  }
};

export default apiClient;