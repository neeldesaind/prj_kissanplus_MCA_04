import axios from 'axios';
import { toast } from 'react-hot-toast';

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            toast.error("Session expired. Please log in again.");
            localStorage.clear();
            window.location.href = "/login-page"; // Force logout and redirect
        }
        return Promise.reject(error);
    }
);
