/**
 * Démarrage en développement avec une base MongoDB EN MÉMOIRE.
 * Pratique pour tester sans installer MongoDB. Les données sont perdues à
 * l'arrêt du process. Pour la prod, utilisez `npm run dev` avec MONGODB_URI.
 */
import "dotenv/config"
import { MongoMemoryServer } from "mongodb-memory-server"
import { connectDB } from "./config/db"
import { createApp } from "./app"
import { seedData } from "./seed/seed"

const PORT = Number(process.env.PORT) || 5000

async function start() {
  console.log("→ Démarrage de MongoDB en mémoire…")
  const mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()

  await connectDB(uri)
  await seedData()

  const app = createApp()
  app.listen(PORT, () => {
    console.log(`✓ API Élégance (in-memory) sur http://localhost:${PORT}`)
  })

  const shutdown = async () => {
    await mongo.stop()
    process.exit(0)
  }
  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
}

start().catch((e) => {
  console.error("Échec du démarrage in-memory :", e)
  process.exit(1)
})
