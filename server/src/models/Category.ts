import { Schema, model, InferSchemaType } from "mongoose"

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    handle: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
)

export type CategoryDoc = InferSchemaType<typeof categorySchema>
export const Category = model("Category", categorySchema)
