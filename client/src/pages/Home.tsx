import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Product, Category } from "../types"
import { fetchProducts, fetchCategories } from "../api/endpoints"
import ProductCard from "../components/ProductCard"

const valueProps = [
  { title: "Livraison 58 wilayas", desc: "Expédition rapide partout en Algérie." },
  { title: "Paiement sécurisé", desc: "CIB, Edahabia ou à la livraison." },
  { title: "Échange facile", desc: "Échange simple sous 7 jours." },
  { title: "Service à l'écoute", desc: "Une équipe disponible du samedi au jeudi." },
]

const testimonials = [
  { quote: "La qualité des tissus est exceptionnelle. Je recommande les yeux fermés.", name: "Lina B.", city: "Alger" },
  { quote: "Livraison rapide et emballage soigné. La robe tombe parfaitement.", name: "Yasmine K.", city: "Oran" },
  { quote: "Un service client adorable qui m'a aidée à choisir ma taille.", name: "Amira S.", city: "Constantine" },
]

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchProducts({ featured: "true", limit: 6 }).then((r) => setFeatured(r.products))
    fetchCategories().then(setCategories)
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="container-x grid min-h-[80vh] grid-cols-1 items-center gap-10 py-16 small:grid-cols-2">
        <div>
          <div className="label-mini mb-6">Automne — Hiver 2026</div>
          <h1 className="font-serif text-5xl font-medium leading-[1.05] small:text-7xl">
            Élégance intemporelle<br />
            <em className="font-normal italic">pour chaque femme</em>
          </h1>
          <p className="my-8 max-w-[430px] text-base font-light leading-[1.7] text-elegance-taupe">
            Découvrez notre nouvelle collection — des matières choisies, des
            coupes pensées pour le quotidien.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/store" className="btn-primary">Découvrir la collection</Link>
          </div>
        </div>
        <div className="aspect-[4/5] bg-gradient-to-br from-[#D9C9B6] to-[#B49B80]" />
      </section>

      {/* Value props */}
      <section className="border-y border-elegance-ink/10 bg-elegance-sand/40">
        <div className="container-x grid grid-cols-2 gap-px medium:grid-cols-4">
          {valueProps.map((v) => (
            <div key={v.title} className="flex flex-col gap-2 py-10 text-center">
              <h3 className="font-serif text-xl">{v.title}</h3>
              <p className="mx-auto max-w-[230px] text-[13px] font-light text-elegance-taupe">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Catégories */}
      {categories.length > 0 && (
        <section className="container-x py-16">
          <div className="mb-10 text-center">
            <span className="label-mini">Nos univers</span>
            <h2 className="mt-3 font-serif text-4xl font-medium small:text-5xl">Explorez par catégorie</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 small:grid-cols-3 medium:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/store?category=${c.handle}`}
                className="group flex aspect-square items-center justify-center bg-elegance-sand text-center transition-colors hover:bg-elegance-ink hover:text-elegance-cream"
              >
                <span className="font-serif text-lg">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sélection */}
      {featured.length > 0 && (
        <section className="container-x py-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-3xl font-medium small:text-4xl">Notre sélection</h2>
            <Link to="/store" className="text-[12px] uppercase tracking-[2px] hover:text-elegance-gold">Voir tout</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 small:grid-cols-3 medium:grid-cols-4">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Témoignages */}
      <section className="border-y border-elegance-ink/10 bg-elegance-sand/40 py-16">
        <div className="container-x">
          <div className="mb-12 text-center">
            <span className="label-mini">Elles nous font confiance</span>
            <h2 className="mt-3 font-serif text-4xl font-medium small:text-5xl">Ce que disent nos clientes</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 small:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex flex-col items-center gap-5 bg-elegance-cream px-8 py-10 text-center">
                <div className="text-elegance-gold">★★★★★</div>
                <blockquote className="font-serif text-lg italic leading-[1.6]">« {t.quote} »</blockquote>
                <figcaption className="label-mini">{t.name} — {t.city}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter (visuel) */}
      <section className="bg-elegance-ink py-20 text-center text-elegance-cream">
        <div className="container-x flex flex-col items-center gap-5">
          <span className="text-[11px] uppercase tracking-[3px] text-elegance-cream/60">La lettre Élégance</span>
          <h2 className="font-serif text-4xl font-medium small:text-5xl">−15% sur votre première commande</h2>
          <Link to="/register" className="mt-4 inline-block bg-elegance-cream px-9 py-4 text-[12px] uppercase tracking-[2px] text-elegance-ink hover:opacity-80">
            Créer mon compte
          </Link>
        </div>
      </section>
    </>
  )
}
