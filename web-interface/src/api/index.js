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

export const fetchErrorMessage = (error) => error?.response?.data?.detail ||
  error?.response?.data?.message ||
  error.message ||
  'Unknown API error'

export const handleApiError = (error) => {
  const message = fetchErrorMessage(error)
  window.toast.error(message)
  return message;
};
