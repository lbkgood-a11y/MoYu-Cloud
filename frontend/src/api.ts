import axios from 'axios';

/** 统一的后端请求客户端。 */
export const api = axios.create({ baseURL: '/api', timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('moyu_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
