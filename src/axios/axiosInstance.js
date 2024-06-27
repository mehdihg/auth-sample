import axios from 'axios';
import { store } from '../store';
import { setCredentials, logout, setError } from '../redux/authSlice';

const axiosInstance = axios.create({
 // baseURL: process.env.REACT_APP_API_URL,
 baseURL: 'http://localhost:5173/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { auth } = store.getState();
    if (auth.accessToken) {
      config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response: { status } } = error;
    const originalRequest = config;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // prevent infinite loop
      const { auth } = store.getState();
      try {
        const response = await axios.post('/api/refresh-token', { refreshToken: auth.refreshToken });
        store.dispatch(setCredentials(response.data));
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        store.dispatch(setError(refreshError.response.data || { message: 'Session expired. Please log in again.' }));
        return Promise.reject(refreshError);
      }
    }
    
    store.dispatch(setError(error.response.data || { message: 'An unexpected error occurred' }));
    return Promise.reject(error);
  }
);

export default axiosInstance;
