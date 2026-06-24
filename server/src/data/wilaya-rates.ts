/**
 * Tarifs de livraison par wilaya (en DZD).
 * `domicile` = livraison à l'adresse, `bureau` = retrait au bureau (stop desk).
 * Estimations par zone — à ajuster selon votre transporteur.
 */
export type WilayaRate = {
  code: string
  name: string
  domicile: number
  bureau: number
}

const Z = {
  centre: { domicile: 400, bureau: 250 },
  est: { domicile: 600, bureau: 350 },
  ouest: { domicile: 600, bureau: 350 },
  sud: { domicile: 800, bureau: 500 },
  grandSud: { domicile: 1000, bureau: 700 },
}

const W = (code: string, name: string, zone: keyof typeof Z): WilayaRate => ({
  code,
  name,
  domicile: Z[zone].domicile,
  bureau: Z[zone].bureau,
})

export const WILAYA_RATES: WilayaRate[] = [
  W("01", "Adrar", "grandSud"),
  W("02", "Chlef", "ouest"),
  W("03", "Laghouat", "sud"),
  W("04", "Oum El Bouaghi", "est"),
  W("05", "Batna", "est"),
  W("06", "Béjaïa", "centre"),
  W("07", "Biskra", "sud"),
  W("08", "Béchar", "grandSud"),
  W("09", "Blida", "centre"),
  W("10", "Bouira", "centre"),
  W("11", "Tamanrasset", "grandSud"),
  W("12", "Tébessa", "est"),
  W("13", "Tlemcen", "ouest"),
  W("14", "Tiaret", "ouest"),
  W("15", "Tizi Ouzou", "centre"),
  W("16", "Alger", "centre"),
  W("17", "Djelfa", "sud"),
  W("18", "Jijel", "est"),
  W("19", "Sétif", "est"),
  W("20", "Saïda", "ouest"),
  W("21", "Skikda", "est"),
  W("22", "Sidi Bel Abbès", "ouest"),
  W("23", "Annaba", "est"),
  W("24", "Guelma", "est"),
  W("25", "Constantine", "est"),
  W("26", "Médéa", "centre"),
  W("27", "Mostaganem", "ouest"),
  W("28", "M'Sila", "sud"),
  W("29", "Mascara", "ouest"),
  W("30", "Ouargla", "grandSud"),
  W("31", "Oran", "ouest"),
  W("32", "El Bayadh", "sud"),
  W("33", "Illizi", "grandSud"),
  W("34", "Bordj Bou Arréridj", "est"),
  W("35", "Boumerdès", "centre"),
  W("36", "El Tarf", "est"),
  W("37", "Tindouf", "grandSud"),
  W("38", "Tissemsilt", "ouest"),
  W("39", "El Oued", "sud"),
  W("40", "Khenchela", "est"),
  W("41", "Souk Ahras", "est"),
  W("42", "Tipaza", "centre"),
  W("43", "Mila", "est"),
  W("44", "Aïn Defla", "centre"),
  W("45", "Naâma", "sud"),
  W("46", "Aïn Témouchent", "ouest"),
  W("47", "Ghardaïa", "sud"),
  W("48", "Relizane", "ouest"),
  W("49", "El M'Ghair", "sud"),
  W("50", "El Meniaa", "grandSud"),
  W("51", "Ouled Djellal", "sud"),
  W("52", "Bordj Badji Mokhtar", "grandSud"),
  W("53", "Béni Abbès", "grandSud"),
  W("54", "Timimoun", "grandSud"),
  W("55", "Touggourt", "sud"),
  W("56", "Djanet", "grandSud"),
  W("57", "In Salah", "grandSud"),
  W("58", "In Guezzam", "grandSud"),
]

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim()

export const findWilaya = (value?: string | null): WilayaRate | undefined => {
  if (!value) return undefined
  const v = norm(value)
  return WILAYA_RATES.find(
    (w) => norm(w.name) === v || w.code === value.padStart(2, "0") || w.code === v
  )
}

/** Calcule le prix de livraison pour une wilaya + un type. */
export const computeShipping = (
  wilaya?: string | null,
  type: "domicile" | "bureau" = "domicile"
): number => {
  const w = findWilaya(wilaya)
  if (!w) return type === "bureau" ? 500 : 700 // tarif de repli
  return w[type]
}
