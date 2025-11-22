import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import { PUBLIC_ROUTES } from "../constants/routes";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});


api.interceptors.request.use(
  async (config) => {

    const isPublicEndpoint = PUBLIC_ROUTES.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    if (isPublicEndpoint) {
      return config;
    }

    const token = await SecureStore.getItemAsync('token');
    
    if (!token) {
      console.log('No authentication token');
      return Promise.reject(new Error('No authentication token'));
    }
    
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;