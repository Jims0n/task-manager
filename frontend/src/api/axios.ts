import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      const { access } = JSON.parse(tokens);
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
          const { refresh } = JSON.parse(tokens);
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh,
          });

          const newTokens = {
            access: response.data.access,
            refresh: response.data.refresh || refresh,
          };
          localStorage.setItem('tokens', JSON.stringify(newTokens));

          originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
