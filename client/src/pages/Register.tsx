import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { register } from "../api/endpoints"
import { apiError } from "../api/client"
import { useAuth } from "../context/AuthContext"

export default function Register() {
  const { setSession } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { token, user } = await register(form)
      setSession(token, user)
      navigate("/account")
    } catch (e) {
      setError(apiError(e, "Inscription impossible"))
      setLoading(false)
    }
  }

  return (
    <div className="container-x flex justify-center py-20">
      <form onSubmit={handleSubmit} className="w-full max-w-[400px]">
        <h1 className="text-center font-serif text-4xl font-medium">Créer un compte</h1>
        <div className="mt-8 flex flex-col gap-4">
          <input required placeholder="Nom complet" value={form.name} onChange={(e) => set("name", e.target.value)} className="field" />
          <input type="email" required placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} className="field" />
          <input placeholder="Téléphone (optionnel)" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="field" />
          <input type="password" required minLength={6} placeholder="Mot de passe (min. 6)" value={form.password} onChange={(e) => set("password", e.target.value)} className="field" />
          {error && <p className="text-[13px] text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "…" : "S'inscrire"}</button>
        </div>
        <p className="mt-6 text-center text-[13px] text-elegance-taupe">
          Déjà un compte ? <Link to="/login" className="text-elegance-gold hover:underline">Se connecter</Link>
        </p>
      </form>
    </div>
  )
}
