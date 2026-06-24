/** Catalogue Élégance — données initiales (prix en DZD). */
export const CATEGORIES = [
  { name: "Robes", handle: "robes" },
  { name: "Blazers", handle: "blazers" },
  { name: "Jupes", handle: "jupes" },
  { name: "Mailles", handle: "mailles" },
  { name: "Hauts", handle: "hauts" },
  { name: "Accessoires", handle: "accessoires" },
]

export type SeedProduct = {
  title: string
  handle: string
  categoryHandle: string
  description: string
  price: number
  colors: string[]
  sizes: string[]
  featured?: boolean
}

const img = (handle: string, n: number) =>
  `https://picsum.photos/seed/elegance-${handle}-${n}/800/1000`

export const PRODUCTS: SeedProduct[] = [
  {
    title: "Robe Nuisette en Soie",
    handle: "robe-nuisette-soie",
    categoryHandle: "robes",
    description:
      "Robe nuisette en soie fluide à la coupe minimaliste, pensée pour passer du jour au soir avec une élégance sans effort.",
    price: 28900,
    colors: ["Sable", "Noir"],
    sizes: ["XS", "S", "M", "L"],
    featured: true,
  },
  {
    title: "Robe Portefeuille",
    handle: "robe-portefeuille",
    categoryHandle: "robes",
    description:
      "Robe portefeuille midi à la silhouette flatteuse, nouée à la taille pour souligner la féminité.",
    price: 25900,
    colors: ["Terracotta", "Noir"],
    sizes: ["XS", "S", "M", "L"],
    featured: true,
  },
  {
    title: "Blazer en Lin",
    handle: "blazer-lin",
    categoryHandle: "blazers",
    description:
      "Blazer structuré en lin aux épaules nettes et au tombé impeccable, à porter ceinturé ou ouvert.",
    price: 35900,
    colors: ["Camel", "Noir"],
    sizes: ["XS", "S", "M", "L"],
    featured: true,
  },
  {
    title: "Manteau en Laine",
    handle: "manteau-laine",
    categoryHandle: "blazers",
    description:
      "Manteau long en laine mélangée, chaud et intemporel, parfait pour la saison froide.",
    price: 42000,
    colors: ["Camel"],
    sizes: ["S", "M", "L"],
  },
  {
    title: "Jupe Mi-longue Plissée",
    handle: "jupe-plissee",
    categoryHandle: "jupes",
    description:
      "Jupe mi-longue plissée au mouvement fluide, taille haute et finition soignée.",
    price: 19900,
    colors: ["Sable"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    title: "Ensemble Maille Cachemire",
    handle: "ensemble-maille-cachemire",
    categoryHandle: "mailles",
    description:
      "Ensemble en maille de cachemire douce — pull et jupe coordonnés, pour un confort luxueux.",
    price: 30900,
    colors: ["Crème"],
    sizes: ["S", "M", "L"],
    featured: true,
  },
  {
    title: "Blouse en Satin",
    handle: "blouse-satin",
    categoryHandle: "hauts",
    description:
      "Blouse en satin au tombé soyeux, élégante et polyvalente, du bureau au dîner.",
    price: 14500,
    colors: ["Ivoire", "Noir"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    title: "Sac Cabas en Cuir",
    handle: "sac-cabas-cuir",
    categoryHandle: "accessoires",
    description:
      "Sac cabas en cuir véritable, format spacieux et anses souples pour accompagner le quotidien.",
    price: 26000,
    colors: ["Cognac"],
    sizes: [],
  },
]

export const productImages = (handle: string) => ({
  thumbnail: img(handle, 1),
  images: [img(handle, 1), img(handle, 2)],
})
