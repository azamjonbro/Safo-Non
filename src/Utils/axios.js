import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3500',
  withCredentials: true,
  timeout: 40000,
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('user')).accessToken; 
    if (token) {
      config.headers.authorization = `${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
