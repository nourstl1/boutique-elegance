import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({
  children,
  admin = false,
}: {
  children: ReactNode
  admin?: boolean
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="container-x py-24 text-center text-elegance-stone">Chargement…</div>
  }
  if (!user) return <Navigate to="/login" replace />
  if (admin && user.role !== "admin") return <Navigate to="/" replace />

  return <>{children}</>
}
