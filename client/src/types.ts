export type Category = {
  _id: string
  name: string
  handle: string
}

export type Product = {
  _id: string
  title: string
  handle: string
  description: string
  price: number
  category: Category | string
  colors: string[]
  sizes: string[]
  images: string[]
  thumbnail: string
  stock: number
  featured: boolean
}

export type ProductListResponse = {
  products: Product[]
  total: number
  page: number
  pages: number
}

export type Wilaya = {
  code: string
  name: string
  domicile: number
  bureau: number
}

export type CartItem = {
  product: string
  handle: string
  title: string
  price: number
  thumbnail: string
  size: string
  color: string
  quantity: number
}

export type User = {
  id: string
  name: string
  email: string
  role: "customer" | "admin"
  phone?: string
}

export type Order = {
  _id: string
  items: {
    title: string
    price: number
    quantity: number
    size: string
    color: string
    thumbnail: string
  }[]
  shippingAddress: {
    fullName: string
    phone: string
    wilaya: string
    city?: string
    address?: string
    deliveryType: "domicile" | "bureau"
  }
  subtotal: number
  shippingCost: number
  total: number
  paymentMethod: "cod" | "chargily"
  paymentStatus: "pending" | "paid" | "failed"
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: string
}
