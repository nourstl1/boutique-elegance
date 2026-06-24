import { Request, Response } from "express"
import { Order } from "../models/Order"
import { Product } from "../models/Product"
import { computeShipping } from "../data/wilaya-rates"
import { createChargilyCheckout, chargilyEnabled } from "../services/chargily"
import { asyncHandler } from "../middleware/error"

const FREE_SHIPPING_THRESHOLD = 15000 // DZD

type IncomingItem = {
  product: string
  quantity: number
  size?: string
  color?: string
}

/** POST /api/orders — crée une commande (COD ou Chargily). */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { items, shippingAddress, paymentMethod } = req.body as {
    items: IncomingItem[]
    shippingAddress: any
    paymentMethod: "cod" | "chargily"
  }

  if (!items?.length) {
    return res.status(400).json({ message: "Panier vide" })
  }
  if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.wilaya) {
    return res.status(400).json({ message: "Adresse de livraison incomplète" })
  }
  if (!["cod", "chargily"].includes(paymentMethod)) {
    return res.status(400).json({ message: "Mode de paiement invalide" })
  }
  if (paymentMethod === "chargily" && !chargilyEnabled()) {
    return res.status(400).json({ message: "Paiement en ligne indisponible" })
  }

  // On recalcule TOUT côté serveur à partir de la base (jamais confiance au client).
  const orderItems = []
  let subtotal = 0
  for (const it of items) {
    const product = await Product.findById(it.product)
    if (!product) {
      return res.status(400).json({ message: `Produit introuvable: ${it.product}` })
    }
    const quantity = Math.max(1, Number(it.quantity) || 1)
    subtotal += product.price * quantity
    orderItems.push({
      product: product._id,
      title: product.title,
      price: product.price,
      quantity,
      size: it.size || "",
      color: it.color || "",
      thumbnail: product.thumbnail,
    })
  }

  const deliveryType =
    shippingAddress.deliveryType === "bureau" ? "bureau" : "domicile"
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : computeShipping(shippingAddress.wilaya, deliveryType)

  const total = subtotal + shippingCost

  const order = await Order.create({
    user: req.user?.id || null,
    items: orderItems,
    shippingAddress: { ...shippingAddress, deliveryType },
    subtotal,
    shippingCost,
    total,
    paymentMethod,
    paymentStatus: "pending",
    status: "pending",
  })

  // Paiement en ligne : on crée le checkout Chargily et on renvoie l'URL.
  if (paymentMethod === "chargily") {
    try {
      const checkout = await createChargilyCheckout({
        amount: total,
        orderId: order._id.toString(),
      })
      order.chargilyCheckoutId = checkout.id
      order.chargilyCheckoutUrl = checkout.url
      await order.save()
      return res.status(201).json({ order, redirectUrl: checkout.url })
    } catch (e: any) {
      await Order.findByIdAndDelete(order._id)
      return res.status(502).json({ message: e.message })
    }
  }

  res.status(201).json({ order })
})

/** GET /api/orders/mine — commandes de l'utilisateur connecté. */
export const myOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ user: req.user!.id }).sort({ createdAt: -1 })
  res.json(orders)
})

/** GET /api/orders/:id — détail (propriétaire ou admin). */
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json({ message: "Commande introuvable" })
  const isOwner = order.user && order.user.toString() === req.user?.id
  if (!isOwner && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé" })
  }
  res.json(order)
})

/** GET /api/orders (admin) — toutes les commandes. */
export const listOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 })
  res.json(orders)
})

/** PUT /api/orders/:id/status (admin) */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, paymentStatus } = req.body
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json({ message: "Commande introuvable" })
  if (status) order.status = status
  if (paymentStatus) order.paymentStatus = paymentStatus
  await order.save()
  res.json(order)
})
