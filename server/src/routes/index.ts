import { Router } from "express"
import {
  listProducts,
  getFilters,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController"
import { listCategories, createCategory } from "../controllers/categoryController"
import { register, login, me } from "../controllers/authController"
import {
  createOrder,
  myOrders,
  getOrder,
  listOrders,
  updateOrderStatus,
} from "../controllers/orderController"
import { listWilayas, quote } from "../controllers/shippingController"
import { requireAuth, requireAdmin, optionalAuth } from "../middleware/auth"

const router = Router()

// --- Produits ---
router.get("/products", listProducts)
router.get("/products/filters", getFilters)
router.get("/products/:handle", getProduct)
router.post("/products", requireAuth, requireAdmin, createProduct)
router.put("/products/:id", requireAuth, requireAdmin, updateProduct)
router.delete("/products/:id", requireAuth, requireAdmin, deleteProduct)

// --- Catégories ---
router.get("/categories", listCategories)
router.post("/categories", requireAuth, requireAdmin, createCategory)

// --- Auth ---
router.post("/auth/register", register)
router.post("/auth/login", login)
router.get("/auth/me", requireAuth, me)

// --- Livraison ---
router.get("/shipping/wilayas", listWilayas)
router.get("/shipping/quote", quote)

// --- Commandes ---
router.post("/orders", optionalAuth, createOrder)
router.get("/orders/mine", requireAuth, myOrders)
router.get("/orders", requireAuth, requireAdmin, listOrders)
router.get("/orders/:id", requireAuth, getOrder)
router.put("/orders/:id/status", requireAuth, requireAdmin, updateOrderStatus)

export default router
