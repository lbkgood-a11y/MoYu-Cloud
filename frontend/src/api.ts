import axios from 'axios';

/** 统一的后端请求客户端。 */
export const api = axios.create({ baseURL: '/api', timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('moyu_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => {
  const body = response.data;
  if (body && body.success === false) return Promise.reject(new Error(body.message || '请求失败'));
  return response;
}, (error) => {
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    localStorage.removeItem('moyu_token');
    window.dispatchEvent(new CustomEvent('moyu:unauthorized'));
  }
  const message = error?.response?.data?.message || error?.message || '网络请求失败';
  return Promise.reject(new Error(message));
});
