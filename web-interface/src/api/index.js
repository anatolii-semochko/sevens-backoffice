import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // або 'http://localhost:8080/api', якщо окремий бекенд
  withCredentials: true, // якщо використовуєш cookie-based автентифікацію
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;


// export const handleApiError = (error) => {
//   console.error(error);
//   return error.response?.data?.message || 'Unknown API error';
// };
