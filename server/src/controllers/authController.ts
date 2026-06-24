import { Request, Response } from "express"
import { User } from "../models/User"
import { signToken } from "../utils/token"
import { asyncHandler } from "../middleware/error"

const publicUser = (u: any) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  phone: u.phone,
})

/** POST /api/auth/register */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Champs requis manquants" })
  }
  const exists = await User.findOne({ email: email.toLowerCase() })
  if (exists) return res.status(409).json({ message: "Email déjà utilisé" })

  const user = await User.create({ name, email, password, phone })
  const token = signToken({ id: user._id.toString(), role: user.role })
  res.status(201).json({ token, user: publicUser(user) })
})

/** POST /api/auth/login */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+password")
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Identifiants invalides" })
  }
  const token = signToken({ id: user._id.toString(), role: user.role })
  res.json({ token, user: publicUser(user) })
})

/** GET /api/auth/me */
export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id)
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable" })
  res.json({ user: publicUser(user) })
})
