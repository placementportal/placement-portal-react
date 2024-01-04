import axios from 'axios';
import { redirect } from 'react-router-dom';

const localAPI = 'http://localhost:5000/api/v1';
const APIUrl = 'https://placement-portal-xk5c.onrender.com/api/v1';

export const customFetch = axios.create({
  baseURL: localAPI,
  withCredentials: true,
});

customFetch.interceptors.response.use(function (response) {
  if (response.status === 401 || response.status === 403) {
    redirect('/');
  }
  return response;
});
