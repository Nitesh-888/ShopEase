import axios from "axios";

const API = axios.create({
  baseURL: API_URL, // backend URL
});

// Add token to requests if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
