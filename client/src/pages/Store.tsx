import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Product } from "../types"
import { fetchProducts, fetchFilters, fetchCategories } from "../api/endpoints"
import ProductCard from "../components/ProductCard"

export default function Store() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<{ sizes: string[]; colors: string[] }>({ sizes: [], colors: [] })
  const [categories, setCategories] = useState<{ name: string; handle: string }[]>([])
  const [searchInput, setSearchInput] = useState(params.get("q") || "")

  const q = params.get("q") || ""
  const category = params.get("category") || ""
  const sizes = (params.get("size") || "").split(",").filter(Boolean)
  const colors = (params.get("color") || "").split(",").filter(Boolean)
  const sort = params.get("sort") || "newest"
  const page = parseInt(params.get("page") || "1")

  useEffect(() => {
    fetchFilters().then(setFilters)
    fetchCategories().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    const query: Record<string, string | number> = { page, limit: 12, sort }
    if (q) query.q = q
    if (category) query.category = category
    if (sizes.length) query.size = sizes.join(",")
    if (colors.length) query.color = colors.join(",")
    fetchProducts(query)
      .then((r) => {
        setProducts(r.products)
        setPages(r.pages)
        setTotal(r.total)
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete("page")
    setParams(next)
  }

  const toggleMulti = (key: string, current: string[], value: string) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    update(key, next.join(","))
  }

  const goPage = (p: number) => {
    const next = new URLSearchParams(params)
    next.set("page", String(p))
    setParams(next)
  }

  return (
    <div className="container-x flex flex-col gap-8 py-10 small:flex-row small:items-start">
      {/* Sidebar filtres */}
      <aside className="flex w-full flex-col gap-8 small:w-[240px] small:shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            update("q", searchInput.trim())
          }}
        >
          <span className="label-mini">Recherche</span>
          <div className="mt-3 flex border border-elegance-ink/20 focus-within:border-elegance-gold">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Rechercher…"
              className="w-full bg-transparent px-3 py-2 text-[14px] focus:outline-none"
            />
            <button type="submit" className="px-3 hover:text-elegance-gold">→</button>
          </div>
        </form>

        {categories.length > 0 && (
          <div>
            <span className="label-mini">Catégorie</span>
            <ul className="mt-3 flex flex-col gap-2 text-[14px]">
              <li>
                <button onClick={() => update("category", "")} className={!category ? "text-elegance-gold" : "hover:text-elegance-gold"}>Toutes</button>
              </li>
              {categories.map((c) => (
                <li key={c.handle}>
                  <button
                    onClick={() => update("category", c.handle)}
                    className={category === c.handle ? "text-elegance-gold" : "hover:text-elegance-gold"}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filters.sizes.length > 0 && (
          <div>
            <span className="label-mini">Taille</span>
            <ul className="mt-3 flex flex-col gap-2 text-[14px]">
              {filters.sizes.map((s) => (
                <li key={s}>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={sizes.includes(s)} onChange={() => toggleMulti("size", sizes, s)} className="accent-elegance-gold" />
                    {s}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filters.colors.length > 0 && (
          <div>
            <span className="label-mini">Couleur</span>
            <ul className="mt-3 flex flex-col gap-2 text-[14px]">
              {filters.colors.map((c) => (
                <li key={c}>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={colors.includes(c)} onChange={() => toggleMulti("color", colors, c)} className="accent-elegance-gold" />
                    {c}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Grille */}
      <div className="w-full">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-medium small:text-4xl">
            {q ? `Résultats pour « ${q} »` : "Tous les produits"}
          </h1>
          <select
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
            className="border border-elegance-ink/20 bg-transparent px-3 py-2 text-[13px] focus:outline-none"
          >
            <option value="newest">Nouveautés</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>

        {loading ? (
          <p className="py-16 text-center text-elegance-stone">Chargement…</p>
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-elegance-taupe">Aucun produit ne correspond à votre recherche.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 small:grid-cols-3 medium:grid-cols-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
            <p className="mt-8 text-center text-[12px] text-elegance-stone">{total} produit(s)</p>
            {pages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goPage(i + 1)}
                    className={`h-9 w-9 border text-[13px] ${page === i + 1 ? "border-elegance-ink bg-elegance-ink text-elegance-cream" : "border-elegance-ink/20 hover:border-elegance-ink"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
