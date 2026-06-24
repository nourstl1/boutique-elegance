import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { formatDZD } from "../lib/format"

export default function Cart() {
  const { items, subtotal, updateQty, removeItem, itemKey } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-serif text-4xl">Votre panier est vide</h1>
        <Link to="/store" className="btn-primary mt-8">Découvrir la boutique</Link>
      </div>
    )
  }

  return (
    <div className="container-x grid grid-cols-1 gap-12 py-10 small:grid-cols-[1.6fr_1fr]">
      <div>
        <h1 className="mb-8 font-serif text-4xl font-medium">Mon panier</h1>
        <ul className="flex flex-col divide-y divide-elegance-ink/10 border-y border-elegance-ink/10">
          {items.map((item) => {
            const key = itemKey(item)
            return (
              <li key={key} className="flex gap-4 py-5">
                <Link to={`/products/${item.handle}`} className="aspect-[3/4] w-24 shrink-0 overflow-hidden bg-elegance-sand">
                  {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <h3 className="font-serif text-lg">{item.title}</h3>
                    <span className="text-[14px] text-elegance-taupe">{formatDZD(item.price * item.quantity)}</span>
                  </div>
                  <p className="mt-1 text-[13px] text-elegance-stone">
                    {[item.color, item.size].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-elegance-ink/20">
                      <button onClick={() => updateQty(key, item.quantity - 1)} className="px-3 py-1">−</button>
                      <span className="px-3 text-[14px]">{item.quantity}</span>
                      <button onClick={() => updateQty(key, item.quantity + 1)} className="px-3 py-1">+</button>
                    </div>
                    <button onClick={() => removeItem(key)} className="text-[12px] uppercase tracking-[1px] text-elegance-stone hover:text-elegance-ink">Retirer</button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <aside className="h-fit bg-elegance-sand/50 p-8">
        <h2 className="font-serif text-2xl">Récapitulatif</h2>
        <div className="mt-6 flex justify-between text-[14px]">
          <span>Sous-total</span>
          <span>{formatDZD(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-[13px] text-elegance-stone">
          <span>Livraison</span>
          <span>Calculée au paiement</span>
        </div>
        <button onClick={() => navigate("/checkout")} className="btn-primary mt-8 w-full">Passer la commande</button>
        <Link to="/store" className="mt-4 block text-center text-[12px] uppercase tracking-[2px] hover:text-elegance-gold">Continuer mes achats</Link>
      </aside>
    </div>
  )
}
