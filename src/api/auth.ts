import axios from "axios";

const API_URL = "http://localhost:3000/auth"; // Your NestJS backend

export interface User {
  id: number;
  username: string;
}

export const registerUser = async (username: string, password: string) => {
  return axios.post(`${API_URL}/register`, { username, password });
};

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token); // Store JWT token
  }
  return response.data;
};

export const getProfile = async (): Promise<{ user: User }> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
