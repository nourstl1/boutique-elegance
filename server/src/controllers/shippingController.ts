import { Request, Response } from "express"
import { WILAYA_RATES, computeShipping } from "../data/wilaya-rates"
import { asyncHandler } from "../middleware/error"

/** GET /api/shipping/wilayas — liste des wilayas + tarifs. */
export const listWilayas = asyncHandler(async (_req: Request, res: Response) => {
  res.json(WILAYA_RATES)
})

/** GET /api/shipping/quote?wilaya=Alger&type=domicile */
export const quote = asyncHandler(async (req: Request, res: Response) => {
  const { wilaya, type } = req.query as Record<string, string>
  const deliveryType = type === "bureau" ? "bureau" : "domicile"
  const cost = computeShipping(wilaya, deliveryType)
  res.json({ wilaya, type: deliveryType, cost })
})
