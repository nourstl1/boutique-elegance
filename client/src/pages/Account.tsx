import { useEffect, useState } from "react"
import { Order } from "../types"
import { fetchMyOrders } from "../api/endpoints"
import { useAuth } from "../context/AuthContext"
import { formatDZD } from "../lib/format"

const statusLabel: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
}

export default function Account() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyOrders().then(setOrders).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container-x py-12">
      <h1 className="font-serif text-4xl font-medium">Bonjour, {user?.name}</h1>
      <p className="mt-2 text-[14px] text-elegance-taupe">{user?.email}</p>

      <h2 className="mt-12 font-serif text-2xl">Mes commandes</h2>
      {loading ? (
        <p className="mt-6 text-elegance-stone">Chargement…</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-elegance-taupe">Vous n'avez pas encore de commande.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {orders.map((o) => (
            <li key={o._id} className="border border-elegance-ink/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[12px] text-elegance-stone">#{o._id.slice(-6)}</span>
                  <p className="text-[13px] text-elegance-taupe">{new Date(o.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <span className="bg-elegance-sand px-3 py-1 text-[12px] uppercase tracking-[1px]">{statusLabel[o.status]}</span>
                <span className="font-serif text-lg">{formatDZD(o.total)}</span>
              </div>
              <ul className="mt-3 text-[13px] text-elegance-taupe">
                {o.items.map((it, i) => (
                  <li key={i}>{it.title} × {it.quantity}{it.size ? ` (${it.size})` : ""}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
