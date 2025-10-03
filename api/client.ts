

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// --- THIS IS THE NEW, SMARTER LOGIC ---

// Get the IP address of your machine.
// If you are using a real device, you must replace 'localhost' with your local IP address.
const getApiUrl = () => {
  // Check if we're in a simulator/emulator or a real device
  if (Constants.isDevice) {
    // YOU MUST REPLACE THIS WITH YOUR COMPUTER'S WIFI IP ADDRESS
    // This is for running on a PHYSICAL phone.
      const YOUR_COMPUTER_IP = '10.246.102.18'; // <--- YOUR MAC'S IP
      return `http://${YOUR_COMPUTER_IP}:3001`;
  } else {
    // We are on a simulator or emulator
    // For iOS Simulator, use localhost. For Android Emulator, use 10.0.2.2.
    const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    return `http://${host}:3001`;
  }
};

const API_URL = getApiUrl();
console.log("Connecting to API at:", API_URL); // For debugging

// ------------------------------------

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
    
    // Check if the response is valid JSON before trying to parse it
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'An API error occurred');
      }
      return data;
    } else {
      // Handle non-JSON responses, like HTML error pages from the server
      const text = await response.text();
      throw new Error(`Received a non-JSON response from the server: ${text}`);
    }
    
  } catch (error) {
    console.error(`API Client Error (${endpoint}):`, error);
    throw error;
  }
};

export default apiClient;
