import axios from 'axios';

const localAPI = 'http://localhost:5000/api/v1';
const APIUrl = 'https://placement-portal-xk5c.onrender.com/api/v1';

export const customFetch = axios.create({
  baseURL: APIUrl,
  withCredentials: true,
});
