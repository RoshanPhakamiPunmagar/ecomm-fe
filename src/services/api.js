// src/api/api.js
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const API_BASE_PATH = process.env.REACT_APP_API_BASE_PATH;
const API_BASE_URL = `${SERVER_URL}${API_BASE_PATH}`;

console.log("API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // allow sending Authorization headers or cookies
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessJWT");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
