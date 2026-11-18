import axios from 'axios';
const base = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://email-assist-54gh.vercel.app' : 'http://localhost:5000');
const api = axios.create({ baseURL: base + '/api' });
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = 'Bearer ' + t;
  return cfg;
});
export default api;


