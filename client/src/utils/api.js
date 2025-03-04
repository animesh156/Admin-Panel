import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:6224/admin", // for development

  withCredentials: true,
});

export default API;
