import express from "express"
import cors from "cors"
import routes from "./routes"
import { notFound, errorHandler } from "./middleware/error"

export function createApp() {
  const app = express()

  const allowed = process.env.CLIENT_URL || "http://localhost:5173"
  app.use(
    cors({
      // Autorise l'origine configurée + tout localhost en développement.
      origin: (origin, cb) => {
        if (!origin || origin === allowed || /^http:\/\/localhost:\d+$/.test(origin)) {
          return cb(null, true)
        }
        cb(new Error("Origine non autorisée par CORS"))
      },
      credentials: true,
    })
  )
  app.use(express.json())

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }))
  app.use("/api", routes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
