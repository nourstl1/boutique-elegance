import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../api/endpoints"
import { apiError } from "../api/client"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { setSession } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { token, user } = await login(email, password)
      setSession(token, user)
      navigate(user.role === "admin" ? "/admin/products" : "/account")
    } catch (e) {
      setError(apiError(e, "Connexion impossible"))
      setLoading(false)
    }
  }

  return (
    <div className="container-x flex justify-center py-20">
      <form onSubmit={handleSubmit} className="w-full max-w-[400px]">
        <h1 className="text-center font-serif text-4xl font-medium">Connexion</h1>
        <div className="mt-8 flex flex-col gap-4">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          <input type="password" required placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="field" />
          {error && <p className="text-[13px] text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "…" : "Se connecter"}</button>
        </div>
        <p className="mt-6 text-center text-[13px] text-elegance-taupe">
          Pas encore de compte ? <Link to="/register" className="text-elegance-gold hover:underline">Créer un compte</Link>
        </p>
      </form>
    </div>
  )
}
