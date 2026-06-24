import { Request, Response } from "express"
import { Product } from "../models/Product"
import { Category } from "../models/Category"
import { asyncHandler } from "../middleware/error"

/** GET /api/products — liste avec recherche, filtres, tri, pagination. */
export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    q,
    category,
    size,
    color,
    sort = "newest",
    page = "1",
    limit = "12",
    featured,
  } = req.query as Record<string, string>

  const filter: Record<string, any> = {}

  if (q) filter.$text = { $search: q }
  if (featured === "true") filter.featured = true

  if (category) {
    const cat = await Category.findOne({ handle: category })
    if (cat) filter.category = cat._id
    else return res.json({ products: [], total: 0, page: 1, pages: 0 })
  }

  if (size) filter.sizes = { $in: size.split(",") }
  if (color) filter.colors = { $in: color.split(",") }

  const sortMap: Record<string, any> = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  }

  const pageNum = Math.max(parseInt(page) || 1, 1)
  const perPage = Math.min(parseInt(limit) || 12, 100)

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name handle")
      .sort(sortMap[sort] || sortMap.newest)
      .skip((pageNum - 1) * perPage)
      .limit(perPage),
    Product.countDocuments(filter),
  ])

  res.json({
    products,
    total,
    page: pageNum,
    pages: Math.ceil(total / perPage),
  })
})

/** GET /api/products/filters — valeurs disponibles (tailles / couleurs). */
export const getFilters = asyncHandler(async (_req: Request, res: Response) => {
  const [sizes, colors] = await Promise.all([
    Product.distinct("sizes"),
    Product.distinct("colors"),
  ])
  res.json({ sizes: sizes.filter(Boolean), colors: colors.filter(Boolean) })
})

/** GET /api/products/:handle */
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findOne({ handle: req.params.handle }).populate(
    "category",
    "name handle"
  )
  if (!product) return res.status(404).json({ message: "Produit introuvable" })
  res.json(product)
})

/** POST /api/products (admin) */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.create(req.body)
  res.status(201).json(product)
})

/** PUT /api/products/:id (admin) */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!product) return res.status(404).json({ message: "Produit introuvable" })
  res.json(product)
})

/** DELETE /api/products/:id (admin) */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) return res.status(404).json({ message: "Produit introuvable" })
  res.json({ message: "Produit supprimé" })
})
