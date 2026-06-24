import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { User } from "../types"
import { fetchMe } from "../api/endpoints"

type AuthContextType = {
  user: User | null
  loading: boolean
  setSession: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }
    fetchMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token")
      })
      .finally(() => setLoading(false))
  }, [])

  const setSession = (token: string, u: User) => {
    localStorage.setItem("token", token)
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
