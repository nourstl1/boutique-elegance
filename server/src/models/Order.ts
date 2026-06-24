import { Schema, model, InferSchemaType, Types } from "mongoose"

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
  },
  { _id: false }
)

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      wilaya: { type: String, required: true },
      city: { type: String, default: "" },
      address: { type: String, default: "" },
      deliveryType: { type: String, enum: ["domicile", "bureau"], default: "domicile" },
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "chargily"], required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    chargilyCheckoutId: { type: String, default: "" },
    chargilyCheckoutUrl: { type: String, default: "" },
  },
  { timestamps: true }
)

export type OrderDoc = InferSchemaType<typeof orderSchema> & {
  _id: Types.ObjectId
}
export const Order = model("Order", orderSchema)
