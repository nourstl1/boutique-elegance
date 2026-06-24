import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Product } from "../types"
import { fetchProduct } from "../api/endpoints"
import { apiError } from "../api/client"
import { useCart } from "../context/CartContext"
import { formatDZD } from "../lib/format"

export default function ProductDetail() {
  const { handle } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState("")
  const [size, setSize] = useState("")
  const [color, setColor] = useState("")
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!handle) return
    fetchProduct(handle)
      .then((p) => {
        setProduct(p)
        setColor(p.colors[0] || "")
        setActiveImg(0)
      })
      .catch((e) => setError(apiError(e, "Produit introuvable")))
  }, [handle])

  if (error) return <div className="container-x py-24 text-center text-elegance-taupe">{error}</div>
  if (!product) return <div className="container-x py-24 text-center text-elegance-stone">Chargement…</div>

  const needsSize = product.sizes.length > 0
  const canAdd = (!needsSize || size) && (product.colors.length === 0 || color)

  const handleAdd = () => {
    addItem({
      product: product._id,
      handle: product.handle,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      size,
      color,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="container-x grid grid-cols-1 gap-12 py-10 small:grid-cols-2">
      {/* Galerie */}
      <div className="flex flex-col gap-3">
        <div className="aspect-[3/4] overflow-hidden bg-elegance-sand">
          {product.images[activeImg] && (
            <img src={product.images[activeImg]} alt={product.title} className="h-full w-full object-cover" />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`aspect-[3/4] w-20 overflow-hidden border ${activeImg === i ? "border-elegance-ink" : "border-transparent"}`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="small:max-w-[440px]">
        <h1 className="font-serif text-4xl font-medium leading-tight">{product.title}</h1>
        <p className="mt-3 text-xl text-elegance-taupe">{formatDZD(product.price)}</p>
        <p className="mt-6 text-[15px] font-light leading-[1.8] text-elegance-taupe">{product.description}</p>

        {product.colors.length > 0 && (
          <div className="mt-8">
            <span className="label-mini">Couleur : {color}</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`border px-4 py-2 text-[13px] ${color === c ? "border-elegance-ink bg-elegance-ink text-elegance-cream" : "border-elegance-ink/30 hover:border-elegance-ink"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {needsSize && (
          <div className="mt-6">
            <span className="label-mini">Taille</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-11 w-11 border text-[13px] ${size === s ? "border-elegance-ink bg-elegance-ink text-elegance-cream" : "border-elegance-ink/30 hover:border-elegance-ink"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleAdd} disabled={!canAdd} className="btn-primary mt-8 w-full">
          {added ? "Ajouté ✓" : "Ajouter au panier"}
        </button>
        {!canAdd && needsSize && !size && (
          <p className="mt-3 text-[13px] text-elegance-stone">Veuillez choisir une taille.</p>
        )}
        <Link to="/store" className="mt-6 inline-block text-[12px] uppercase tracking-[2px] hover:text-elegance-gold">← Retour à la boutique</Link>
      </div>
    </div>
  )
}
