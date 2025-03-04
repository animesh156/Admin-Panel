import axios from "axios";

const API = axios.create({
  baseURL: "https://admin-panel-backend-xi.vercel.app/admin",

  withCredentials: true,
});

export default API;
