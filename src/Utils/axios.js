import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://api.alphae.uz',
  // baseURL:"http://192.168.1.5:3500",
  baseURL: "http://localhost:3500",
<<<<<<< HEAD
  // baseURL:"http://localhost:3500",
=======
>>>>>>> ef7c3b8cf7b1ed5bb1ff509cd8a1c112d43946d3
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
    if (token) {
      config.headers.authorization = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 403) {
//       localStorage.removeItem("user"); 
//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );


export default api;