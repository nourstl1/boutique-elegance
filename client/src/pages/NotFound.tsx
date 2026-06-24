import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-32 text-center">
      <h1 className="font-serif text-6xl font-medium">404</h1>
      <p className="mt-4 text-elegance-taupe">Cette page n'existe pas.</p>
      <Link to="/" className="btn-primary mt-8">Retour à l'accueil</Link>
    </div>
  )
}
