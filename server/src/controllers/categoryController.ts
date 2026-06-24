import { Request, Response } from "express"
import { Category } from "../models/Category"
import { asyncHandler } from "../middleware/error"

/** GET /api/categories */
export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find().sort({ name: 1 })
  res.json(categories)
})

/** POST /api/categories (admin) */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.create(req.body)
  res.status(201).json(category)
})
