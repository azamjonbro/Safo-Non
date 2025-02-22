import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  // baseURL: 'https://api.alphae.uz',
  baseURL: 'http://localhost:3500',
=======
  baseURL: 'http://192.168.1.5:3500',
>>>>>>> 5c2b138c5cd9b01e9478994bf98aeb159d9ca852
  withCredentials: true,
  timeout: 40000,
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).accessToken : null;
    console.log(token);
    
    if (token) {
      config.headers.authorization = `${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

export default api;