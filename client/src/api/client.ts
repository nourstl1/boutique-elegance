import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
})

// Injecte le token JWT s'il existe.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function apiError(e: unknown, fallback = "Une erreur est survenue") {
  if (axios.isAxiosError(e)) {
    return e.response?.data?.message || fallback
  }
  return fallback
}
