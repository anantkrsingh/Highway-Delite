import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export async function GET<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await api.get<T>(endpoint, config);
  return response.data;
}

export async function POST<T>(
  endpoint: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.post<T>(endpoint, body, config);
  return response.data;
}

export async function PUT<T>(
  endpoint: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.put<T>(endpoint, body, config);
  return response.data;
}

export async function DELETE<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.delete<T>(endpoint, config);
  return response.data;
}

export default api;
