import { Schema, model, InferSchemaType, Types, Model } from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
)

type UserMethods = {
  comparePassword(candidate: string): Promise<boolean>
}

type UserModel = Model<InferSchemaType<typeof userSchema>, {}, UserMethods>

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

export type UserDoc = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId
} & UserMethods
export const User = model<InferSchemaType<typeof userSchema>, UserModel>(
  "User",
  userSchema
)
