import "dotenv/config"
import mongoose from "mongoose"
import { connectDB } from "../config/db"
import { Category } from "../models/Category"
import { Product } from "../models/Product"
import { User } from "../models/User"
import { CATEGORIES, PRODUCTS, productImages } from "./catalog"

const ADMIN_EMAIL = "admin@elegance.dz"
const ADMIN_PASSWORD = "Admin1234!"

/** Remplit la base (suppose une connexion Mongoose déjà ouverte). */
export async function seedData() {
  console.log("→ Nettoyage des collections…")
  await Promise.all([Product.deleteMany({}), Category.deleteMany({})])

  console.log("→ Création des catégories…")
  const cats = await Category.insertMany(CATEGORIES)
  const idByHandle: Record<string, mongoose.Types.ObjectId> = {}
  cats.forEach((c) => (idByHandle[c.handle] = c._id))

  console.log("→ Création des produits…")
  await Product.insertMany(
    PRODUCTS.map((p) => ({
      title: p.title,
      handle: p.handle,
      description: p.description,
      price: p.price,
      category: idByHandle[p.categoryHandle],
      colors: p.colors,
      sizes: p.sizes,
      featured: p.featured || false,
      ...productImages(p.handle),
    }))
  )

  console.log("→ Compte administrateur…")
  const existing = await User.findOne({ email: ADMIN_EMAIL })
  if (!existing) {
    await User.create({
      name: "Admin Élégance",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    })
    console.log(`   Admin : ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
  } else {
    console.log("   Admin déjà existant.")
  }

  console.log(`✓ Seed : ${CATEGORIES.length} catégories, ${PRODUCTS.length} produits.`)
}

// Exécution en CLI : `npm run seed`
async function cli() {
  await connectDB(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/elegance")
  await seedData()
  await mongoose.disconnect()
  process.exit(0)
}

if (require.main === module) {
  cli().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
