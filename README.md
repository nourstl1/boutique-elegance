# Élégance — Boutique MERN (React + Express + MongoDB)

Boutique de mode féminine pour le marché **algérien** : prix en **DZD**,
paiement **Chargily** (CIB / Edahabia) ou **à la livraison (COD)**, livraison
par **wilaya**, design « quiet luxury » Élégance.

```
elegance-mern/
├── server/   # API REST — Node.js + Express + MongoDB (Mongoose) + TypeScript
└── client/   # Boutique — React + TypeScript + Vite + Tailwind + React Router
```

## Stack

| Couche | Techno |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind, React Router, Axios |
| Backend | Node.js, Express, Mongoose, JWT (auth), TypeScript |
| Base de données | MongoDB (local ou Atlas) |
| Paiement | Chargily Pay (DZD) + Paiement à la livraison |

---

## 1. Prérequis
- **Node.js ≥ 18**
- **MongoDB** : local (service `mongod`) ou un cluster **MongoDB Atlas** (free tier).

## 2. Backend (`server/`)
```bash
cd server
cp .env.example .env          # puis renseigner MONGODB_URI, JWT_SECRET, (Chargily)
npm install
npm run seed                  # crée catégories + produits + admin (admin@elegance.dz / Admin1234!)
npm run dev                   # API sur http://localhost:5000
```

## 3. Frontend (`client/`)
```bash
cd client
cp .env.example .env          # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                   # boutique sur http://localhost:5173
```

---

## API REST (résumé)

| Méthode | Route | Accès | Rôle |
|---|---|---|---|
| GET | `/api/products` | public | liste + `q`, `category`, `size`, `color`, `sort`, `page` |
| GET | `/api/products/filters` | public | tailles & couleurs disponibles |
| GET | `/api/products/:handle` | public | détail produit |
| POST/PUT/DELETE | `/api/products[/:id]` | admin | CRUD produit |
| GET | `/api/categories` | public | catégories |
| POST | `/api/auth/register` · `/login` | public | renvoie un JWT |
| GET | `/api/auth/me` | auth | profil courant |
| GET | `/api/shipping/wilayas` · `/quote` | public | tarifs livraison par wilaya |
| POST | `/api/orders` | public/auth | crée commande (COD ou Chargily) |
| GET | `/api/orders/mine` | auth | mes commandes |
| GET | `/api/orders` | admin | toutes les commandes |
| PUT | `/api/orders/:id/status` | admin | maj statut |

## Notes
- **Sécurité prix** : le backend recalcule systématiquement les prix et la
  livraison à partir de la base — jamais à partir des données du client.
- **Livraison offerte** dès 15 000 DA. Tarifs par wilaya dans
  `server/src/data/wilaya-rates.ts`.
- **Chargily** : laisser `CHARGILY_SECRET_KEY` vide désactive le paiement en
  ligne (le COD reste disponible).
- **WhatsApp** : remplacer le numéro dans `client/src/components/WhatsAppButton.tsx`.
- **Admin** : se connecter avec le compte seedé puis menu « Admin ».
