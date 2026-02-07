import axios from 'axios';
import { API_BASE_URL } from '../config';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor removed to allow AuthContext to handle 401s and token refreshes
// axiosInstance.interceptors.response.use(...)

export default axiosInstance;
