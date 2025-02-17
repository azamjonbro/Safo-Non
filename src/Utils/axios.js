import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3800',
  withCredentials: true,
  timeout: 40000,
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
  },
});

export default api;
