/** Formate un montant DZD : 28900 -> "28 900 DA". */
export function formatDZD(amount: number): string {
  return `${amount.toLocaleString("fr-FR").replace(/ /g, " ")} DA`
}
