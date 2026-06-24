import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "dev-secret"

export type JwtPayload = { id: string; role: string }

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload
}
