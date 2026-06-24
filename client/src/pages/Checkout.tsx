import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { Wilaya } from "../types"
import { fetchWilayas, createOrder } from "../api/endpoints"
import { apiError } from "../api/client"
import { formatDZD } from "../lib/format"

const FREE_SHIPPING = 15000

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const navigate = useNavigate()

  const [wilayas, setWilayas] = useState<Wilaya[]>([])
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    wilaya: "",
    city: "",
    address: "",
    deliveryType: "domicile" as "domicile" | "bureau",
  })
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "chargily">("cod")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchWilayas().then(setWilayas)
  }, [])

  useEffect(() => {
    if (items.length === 0) navigate("/cart")
  }, [items.length, navigate])

  const shippingCost = useMemo(() => {
    if (subtotal >= FREE_SHIPPING) return 0
    const w = wilayas.find((x) => x.name === form.wilaya)
    if (!w) return null
    return form.deliveryType === "bureau" ? w.bureau : w.domicile
  }, [wilayas, form.wilaya, form.deliveryType, subtotal])

  const total = subtotal + (shippingCost ?? 0)

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const { order, redirectUrl } = await createOrder({
        items: items.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        shippingAddress: form,
        paymentMethod,
      })
      clear()
      if (redirectUrl) {
        window.location.href = redirectUrl // Chargily
      } else {
        navigate(`/order/confirmed?order=${order._id}`)
      }
    } catch (e) {
      setError(apiError(e, "La commande a échoué"))
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container-x grid grid-cols-1 gap-12 py-10 small:grid-cols-[1.4fr_1fr]">
      <div>
        <h1 className="mb-8 font-serif text-4xl font-medium">Commande</h1>

        <span className="label-mini">Coordonnées & livraison</span>
        <div className="mt-4 grid grid-cols-1 gap-4 small:grid-cols-2">
          <input required placeholder="Nom complet" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className="field small:col-span-2" />
          <input required placeholder="Téléphone" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="field" />
          <select required value={form.wilaya} onChange={(e) => set("wilaya", e.target.value)} className="field">
            <option value="">Wilaya…</option>
            {wilayas.map((w) => (
              <option key={w.code} value={w.name}>{w.code} — {w.name}</option>
            ))}
          </select>
          <input placeholder="Commune / ville" value={form.city} onChange={(e) => set("city", e.target.value)} className="field" />
          <input placeholder="Adresse" value={form.address} onChange={(e) => set("address", e.target.value)} className="field" />
        </div>

        <span className="label-mini mt-8 block">Mode de livraison</span>
        <div className="mt-3 flex gap-3">
          {(["domicile", "bureau"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => set("deliveryType", t)}
              className={`flex-1 border px-4 py-3 text-[13px] ${form.deliveryType === t ? "border-elegance-ink bg-elegance-ink text-elegance-cream" : "border-elegance-ink/30 hover:border-elegance-ink"}`}
            >
              {t === "domicile" ? "À domicile" : "Au bureau (stop desk)"}
            </button>
          ))}
        </div>

        <span className="label-mini mt-8 block">Paiement</span>
        <div className="mt-3 flex flex-col gap-3">
          <label className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-[14px] ${paymentMethod === "cod" ? "border-elegance-ink" : "border-elegance-ink/30"}`}>
            <input type="radio" name="pay" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-elegance-gold" />
            Paiement à la livraison (espèces)
          </label>
          <label className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-[14px] ${paymentMethod === "chargily" ? "border-elegance-ink" : "border-elegance-ink/30"}`}>
            <input type="radio" name="pay" checked={paymentMethod === "chargily"} onChange={() => setPaymentMethod("chargily")} className="accent-elegance-gold" />
            Carte CIB / Edahabia (Chargily)
          </label>
        </div>
      </div>

      {/* Récap */}
      <aside className="h-fit bg-elegance-sand/50 p-8">
        <h2 className="font-serif text-2xl">Votre commande</h2>
        <ul className="mt-5 flex flex-col gap-3 border-b border-elegance-ink/10 pb-5 text-[13px]">
          {items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-3">
              <span className="text-elegance-taupe">{i.title} × {i.quantity}{i.size ? ` (${i.size})` : ""}</span>
              <span>{formatDZD(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex justify-between text-[14px]">
          <span>Sous-total</span><span>{formatDZD(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-[14px]">
          <span>Livraison</span>
          <span>{shippingCost === null ? "—" : shippingCost === 0 ? "Offerte" : formatDZD(shippingCost)}</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-elegance-ink/10 pt-4 font-serif text-xl">
          <span>Total</span><span>{formatDZD(total)}</span>
        </div>

        {error && <p className="mt-4 text-[13px] text-red-700">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
          {submitting ? "Traitement…" : paymentMethod === "chargily" ? "Payer en ligne" : "Confirmer la commande"}
        </button>
        <p className="mt-3 text-center text-[12px] text-elegance-stone">Livraison offerte dès {formatDZD(FREE_SHIPPING)}</p>
      </aside>
    </form>
  )
}
