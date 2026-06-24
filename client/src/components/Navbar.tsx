import { Link, NavLink, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

const announcements = [
  "Livraison offerte dès 15 000 DA",
  "Nouvelle saison disponible",
  "−15% sur votre première commande",
]

export default function Navbar() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-50">
      {/* Bandeau */}
      <div className="bg-elegance-ink py-2 text-center text-elegance-cream">
        <span className="text-[11px] uppercase tracking-[3px]">
          {announcements.join("  ◆  ")}
        </span>
      </div>

      {/* Header */}
      <header className="border-b border-elegance-ink/10 bg-elegance-cream/90 backdrop-blur-lg">
        <nav className="container-x flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center gap-x-7">
            <NavLink
              to="/store"
              className="text-[12px] uppercase tracking-[1.6px] hover:text-elegance-gold"
            >
              Boutique
            </NavLink>
          </div>

          <Link
            to="/"
            className="font-serif text-2xl font-medium uppercase tracking-[5px]"
          >
            Élégance
          </Link>

          <div className="flex flex-1 items-center justify-end gap-x-5 text-[12px] uppercase tracking-[1.6px]">
            {user?.role === "admin" && (
              <NavLink to="/admin/products" className="hover:text-elegance-gold">
                Admin
              </NavLink>
            )}
            {user ? (
              <>
                <NavLink to="/account" className="hidden hover:text-elegance-gold small:inline">
                  {user.name.split(" ")[0]}
                </NavLink>
                <button
                  onClick={() => {
                    logout()
                    navigate("/")
                  }}
                  className="hover:text-elegance-gold"
                >
                  Sortir
                </button>
              </>
            ) : (
              <NavLink to="/login" className="hover:text-elegance-gold">
                Compte
              </NavLink>
            )}
            <NavLink to="/cart" className="hover:text-elegance-gold">
              Panier ({count})
            </NavLink>
          </div>
        </nav>
      </header>
    </div>
  )
}
