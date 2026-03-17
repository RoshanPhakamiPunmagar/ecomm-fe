// import axios from "axios";

// export const SERVER_URL = "http://localhost:3000";
// export const API_BASE_URL = `${SERVER_URL}/api/customer/v1`;

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessJWT");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;

import axios from "axios";

const isProd = process.env.NODE_ENV === "production";

export const SERVER_URL = isProd
  ? "http://ecomm-be-env-1.eba-iwpeiqgf.us-east-1.elasticbeanstalk.com" // EC2 backend
  : "http://localhost:3000";

export const API_BASE_URL = `${SERVER_URL}/api/customer/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessJWT");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
