import { Link } from "react-router-dom"
import { Product } from "../types"
import { formatDZD } from "../lib/format"

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.handle}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-elegance-sand">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <h3 className="font-serif text-lg leading-tight text-elegance-ink">
          {product.title}
        </h3>
        <span className="text-[14px] text-elegance-taupe">
          {formatDZD(product.price)}
        </span>
      </div>
    </Link>
  )
}
