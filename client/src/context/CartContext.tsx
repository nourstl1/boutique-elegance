import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react"
import { CartItem } from "../types"

type CartContextType = {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (item: CartItem) => void
  updateQty: (key: string, qty: number) => void
  removeItem: (key: string) => void
  clear: () => void
  itemKey: (i: Pick<CartItem, "product" | "size" | "color">) => string
}

const CartContext = createContext<CartContextType | null>(null)
const STORAGE_KEY = "elegance_cart"

const keyOf = (i: Pick<CartItem, "product" | "size" | "color">) =>
  `${i.product}|${i.size}|${i.color}`

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const k = keyOf(item)
      const existing = prev.find((p) => keyOf(p) === k)
      if (existing) {
        return prev.map((p) =>
          keyOf(p) === k ? { ...p, quantity: p.quantity + item.quantity } : p
        )
      }
      return [...prev, item]
    })
  }

  const updateQty = (key: string, qty: number) =>
    setItems((prev) =>
      prev.map((p) => (keyOf(p) === key ? { ...p, quantity: Math.max(1, qty) } : p))
    )

  const removeItem = (key: string) =>
    setItems((prev) => prev.filter((p) => keyOf(p) !== key))

  const clear = () => setItems([])

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.quantity, 0),
    }),
    [items]
  )

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, addItem, updateQty, removeItem, clear, itemKey: keyOf }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
