import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const productApi = axios.create({
  baseURL: `${BASE_URL}/products`,
});
