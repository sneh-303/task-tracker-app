import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "https://task-tracker-app-trbn.onrender.com/api",
});

export default api;
