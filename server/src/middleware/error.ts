import { Request, Response, NextFunction } from "express"

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Route introuvable" })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({ message: err.message || "Erreur serveur" })
}

/** Wrapper pour attraper les erreurs async sans try/catch partout. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)
