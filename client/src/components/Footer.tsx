import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="mt-20 bg-elegance-ink text-elegance-cream/80">
      <div className="container-x grid grid-cols-1 gap-12 py-16 small:grid-cols-3">
        <div>
          <span className="font-serif text-3xl uppercase tracking-[5px] text-elegance-cream">
            Élégance
          </span>
          <p className="mt-5 max-w-[280px] text-[13px] font-light leading-[1.8] text-elegance-cream/60">
            Mode féminine intemporelle. Livraison partout en Algérie, paiement
            CIB & Edahabia ou à la livraison.
          </p>
        </div>
        <div>
          <span className="label-mini text-elegance-cream">Boutique</span>
          <ul className="mt-5 flex flex-col gap-3 text-[13px] font-light text-elegance-cream/60">
            <li><Link to="/store" className="hover:text-elegance-cream">Tous les produits</Link></li>
            <li><Link to="/cart" className="hover:text-elegance-cream">Mon panier</Link></li>
            <li><Link to="/account" className="hover:text-elegance-cream">Mon compte</Link></li>
          </ul>
        </div>
        <div>
          <span className="label-mini text-elegance-cream">Service client</span>
          <p className="mt-5 text-[13px] font-light leading-[1.8] text-elegance-cream/60">
            Livraison dans les 58 wilayas.<br />
            Échange sous 7 jours.<br />
            Paiement sécurisé CIB · Edahabia.
          </p>
        </div>
      </div>
      <div className="border-t border-elegance-cream/10">
        <div className="container-x flex flex-wrap justify-between gap-3 py-6 text-[11px] tracking-[1px] text-elegance-cream/50">
          <span>© {new Date().getFullYear()} Élégance. Tous droits réservés.</span>
          <span>Paiements sécurisés ◆ CIB · Edahabia</span>
        </div>
      </div>
    </footer>
  )
}
