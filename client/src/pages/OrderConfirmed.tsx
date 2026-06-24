import { Link, useSearchParams } from "react-router-dom"

export default function OrderConfirmed() {
  const [params] = useSearchParams()
  const orderId = params.get("order")

  return (
    <div className="container-x flex flex-col items-center py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-elegance-gold/15 text-3xl text-elegance-gold">✓</div>
      <h1 className="font-serif text-4xl font-medium small:text-5xl">Merci pour votre commande !</h1>
      <p className="mt-5 max-w-[460px] text-[15px] font-light leading-[1.8] text-elegance-taupe">
        Votre commande a bien été enregistrée. Notre équipe vous contactera très
        bientôt pour confirmer la livraison.
      </p>
      {orderId && <p className="mt-3 text-[12px] text-elegance-stone">Référence : {orderId}</p>}
      <div className="mt-8 flex gap-4">
        <Link to="/store" className="btn-outline">Continuer mes achats</Link>
        <Link to="/account" className="btn-primary">Mes commandes</Link>
      </div>
    </div>
  )
}
