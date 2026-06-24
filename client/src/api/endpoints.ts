import { api } from "./client"
import {
  Category,
  Order,
  Product,
  ProductListResponse,
  User,
  Wilaya,
} from "../types"

// --- Produits ---
export async function fetchProducts(params: Record<string, string | number>) {
  const { data } = await api.get<ProductListResponse>("/products", { params })
  return data
}
export async function fetchProduct(handle: string) {
  const { data } = await api.get<Product>(`/products/${handle}`)
  return data
}
export async function fetchFilters() {
  const { data } = await api.get<{ sizes: string[]; colors: string[] }>(
    "/products/filters"
  )
  return data
}

// --- Catégories ---
export async function fetchCategories() {
  const { data } = await api.get<Category[]>("/categories")
  return data
}

// --- Livraison ---
export async function fetchWilayas() {
  const { data } = await api.get<Wilaya[]>("/shipping/wilayas")
  return data
}

// --- Auth ---
export async function login(email: string, password: string) {
  const { data } = await api.post<{ token: string; user: User }>("/auth/login", {
    email,
    password,
  })
  return data
}
export async function register(payload: {
  name: string
  email: string
  password: string
  phone?: string
}) {
  const { data } = await api.post<{ token: string; user: User }>(
    "/auth/register",
    payload
  )
  return data
}
export async function fetchMe() {
  const { data } = await api.get<{ user: User }>("/auth/me")
  return data.user
}

// --- Commandes ---
export async function createOrder(payload: any) {
  const { data } = await api.post<{ order: Order; redirectUrl?: string }>(
    "/orders",
    payload
  )
  return data
}
export async function fetchMyOrders() {
  const { data } = await api.get<Order[]>("/orders/mine")
  return data
}
export async function fetchOrder(id: string) {
  const { data } = await api.get<Order>(`/orders/${id}`)
  return data
}

// --- Admin ---
export async function adminCreateProduct(payload: Partial<Product>) {
  const { data } = await api.post<Product>("/products", payload)
  return data
}
export async function adminUpdateProduct(id: string, payload: Partial<Product>) {
  const { data } = await api.put<Product>(`/products/${id}`, payload)
  return data
}
export async function adminDeleteProduct(id: string) {
  const { data } = await api.delete(`/products/${id}`)
  return data
}
export async function adminFetchOrders() {
  const { data } = await api.get<Order[]>("/orders")
  return data
}
export async function adminUpdateOrderStatus(
  id: string,
  payload: { status?: string; paymentStatus?: string }
) {
  const { data } = await api.put<Order>(`/orders/${id}/status`, payload)
  return data
}
