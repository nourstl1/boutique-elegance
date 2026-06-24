import "dotenv/config"
import { createApp } from "./app"
import { connectDB } from "./config/db"

const PORT = Number(process.env.PORT) || 5000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/elegance"

async function start() {
  try {
    await connectDB(MONGODB_URI)
    const app = createApp()
    app.listen(PORT, () => {
      console.log(`✓ API Élégance sur http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("Échec du démarrage :", err)
    process.exit(1)
  }
}

start()
