import { Schema, model, InferSchemaType, Types } from "mongoose"

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    handle: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    /** Prix en DZD (dinar algérien) */
    price: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    images: { type: [String], default: [] },
    thumbnail: { type: String, default: "" },
    stock: { type: Number, default: 100 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Index texte pour la recherche (titre + description).
productSchema.index({ title: "text", description: "text" })

export type ProductDoc = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId
}
export const Product = model("Product", productSchema)
