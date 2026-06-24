import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Order } from "../../types"
import { adminFetchOrders, adminUpdateOrderStatus } from "../../api/endpoints"
import { formatDZD } from "../../lib/format"

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"]
const statusLabel: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => adminFetchOrders().then(setOrders).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const changeStatus = async (id: string, status: string) => {
    await adminUpdateOrderStatus(id, { status })
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: status as Order["status"] } : o)))
  }

  return (
    <div className="container-x py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-4xl font-medium">Commandes</h1>
        <Link to="/admin/products" className="text-[12px] uppercase tracking-[2px] hover:text-elegance-gold">← Produits</Link>
      </div>

      {loading ? (
        <p className="text-elegance-stone">Chargement…</p>
      ) : orders.length === 0 ? (
        <p className="text-elegance-taupe">Aucune commande.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((o) => (
            <li key={o._id} className="border border-elegance-ink/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[12px] text-elegance-stone">#{o._id.slice(-6)}</span>
                  <p className="text-[14px]">{o.shippingAddress.fullName} — {o.shippingAddress.phone}</p>
                  <p className="text-[13px] text-elegance-taupe">{o.shippingAddress.wilaya} · {o.shippingAddress.deliveryType === "bureau" ? "Bureau" : "Domicile"} · {o.paymentMethod === "cod" ? "COD" : "Chargily"}</p>
                </div>
                <span className="font-serif text-lg">{formatDZD(o.total)}</span>
                <select
                  value={o.status}
                  onChange={(e) => changeStatus(o._id, e.target.value)}
                  className="border border-elegance-ink/20 bg-transparent px-3 py-2 text-[13px] focus:outline-none"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
                </select>
              </div>
              <ul className="mt-3 text-[13px] text-elegance-taupe">
                {o.items.map((it, i) => (
                  <li key={i}>{it.title} × {it.quantity}{it.size ? ` (${it.size})` : ""}{it.color ? ` · ${it.color}` : ""}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
