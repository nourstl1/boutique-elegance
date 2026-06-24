import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Product, Category } from "../../types"
import {
  fetchProducts,
  fetchCategories,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from "../../api/endpoints"
import { apiError } from "../../api/client"
import { formatDZD } from "../../lib/format"

const empty = {
  title: "",
  handle: "",
  description: "",
  price: 0,
  category: "",
  colors: "",
  sizes: "",
  thumbnail: "",
  featured: false,
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...empty })
  const [error, setError] = useState("")

  const load = () =>
    fetchProducts({ limit: 100 }).then((r) => setProducts(r.products))

  useEffect(() => {
    load()
    fetchCategories().then((c) => {
      setCategories(c)
      setForm((f) => ({ ...f, category: c[0]?._id || "" }))
    })
  }, [])

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const resetForm = () => {
    setEditingId(null)
    setForm({ ...empty, category: categories[0]?._id || "" })
  }

  const startEdit = (p: Product) => {
    setEditingId(p._id)
    setForm({
      title: p.title,
      handle: p.handle,
      description: p.description,
      price: p.price,
      category: typeof p.category === "string" ? p.category : p.category._id,
      colors: p.colors.join(", "),
      sizes: p.sizes.join(", "),
      thumbnail: p.thumbnail,
      featured: p.featured,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const payload: any = {
      title: form.title,
      handle: form.handle,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      thumbnail: form.thumbnail,
      images: form.thumbnail ? [form.thumbnail] : [],
      featured: form.featured,
    }
    try {
      if (editingId) await adminUpdateProduct(editingId, payload)
      else await adminCreateProduct(payload)
      resetForm()
      load()
    } catch (e) {
      setError(apiError(e, "Échec de l'enregistrement"))
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return
    await adminDeleteProduct(id)
    load()
  }

  return (
    <div className="container-x py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-4xl font-medium">Produits</h1>
        <Link to="/admin/orders" className="text-[12px] uppercase tracking-[2px] hover:text-elegance-gold">Commandes →</Link>
      </div>

      {/* Formulaire */}
      <form onSubmit={submit} className="mb-12 grid grid-cols-1 gap-4 bg-elegance-sand/40 p-6 small:grid-cols-2">
        <h2 className="font-serif text-2xl small:col-span-2">{editingId ? "Modifier le produit" : "Nouveau produit"}</h2>
        <input required placeholder="Titre" value={form.title} onChange={(e) => set("title", e.target.value)} className="field" />
        <input required placeholder="Handle (slug)" value={form.handle} onChange={(e) => set("handle", e.target.value)} className="field" />
        <input required type="number" placeholder="Prix (DZD)" value={form.price} onChange={(e) => set("price", e.target.value)} className="field" />
        <select value={form.category} onChange={(e) => set("category", e.target.value)} className="field">
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input placeholder="Couleurs (séparées par ,)" value={form.colors} onChange={(e) => set("colors", e.target.value)} className="field" />
        <input placeholder="Tailles (séparées par ,)" value={form.sizes} onChange={(e) => set("sizes", e.target.value)} className="field" />
        <input placeholder="URL image" value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} className="field small:col-span-2" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => set("description", e.target.value)} className="field small:col-span-2" rows={3} />
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-elegance-gold" /> Mise en avant (accueil)
        </label>
        {error && <p className="text-[13px] text-red-700 small:col-span-2">{error}</p>}
        <div className="flex gap-3 small:col-span-2">
          <button type="submit" className="btn-primary">{editingId ? "Enregistrer" : "Ajouter"}</button>
          {editingId && <button type="button" onClick={resetForm} className="btn-outline">Annuler</button>}
        </div>
      </form>

      {/* Liste */}
      <table className="w-full text-left text-[14px]">
        <thead className="border-b border-elegance-ink/20 text-[12px] uppercase tracking-[1px] text-elegance-stone">
          <tr><th className="py-3">Produit</th><th>Prix</th><th>Avant</th><th className="text-right">Actions</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b border-elegance-ink/10">
              <td className="py-3">{p.title}</td>
              <td>{formatDZD(p.price)}</td>
              <td>{p.featured ? "★" : "—"}</td>
              <td className="py-3 text-right">
                <button onClick={() => startEdit(p)} className="mr-4 text-elegance-gold hover:underline">Éditer</button>
                <button onClick={() => remove(p._id)} className="text-red-700 hover:underline">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
