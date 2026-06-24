import { Request, Response, NextFunction } from "express"
import { verifyToken, JwtPayload } from "../utils/token"

// Étend Request pour transporter l'utilisateur authentifié.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

/** Exige un token valide (Authorization: Bearer <token>). */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Non authentifié" })
  }
  try {
    req.user = verifyToken(header.slice(7))
    next()
  } catch {
    return res.status(401).json({ message: "Token invalide" })
  }
}

/** Optionnel : décode le token s'il existe, sans bloquer. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (header?.startsWith("Bearer ")) {
    try {
      req.user = verifyToken(header.slice(7))
    } catch {
      /* ignore */
    }
  }
  next()
}

/** Exige le rôle admin (à utiliser après requireAuth). */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Accès réservé à l'administrateur" })
  }
  next()
}
