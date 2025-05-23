# Application E-commerce

Une application e-commerce fullstack construite avec Node.js, Express, MongoDB et React.

## 🚀 Fonctionnalités

### Utilisateurs
- Authentification (inscription/connexion)
- Gestion des rôles (admin/user)
- Profil utilisateur personnalisé
- Historique des commandes

### Produits
- Catalogue de produits
- Recherche et filtrage
- Gestion du panier
- Système de commande

### Administration
- Gestion des utilisateurs
- Gestion des produits
- Suivi des commandes
- Tableau de bord administrateur

## 🛠 Technologies Utilisées

### Backend
- Node.js
- Express
- MongoDB avec Mongoose
- JWT pour l'authentification
- bcryptjs pour le cryptage

### Frontend
- React
- React Router pour la navigation
- Axios pour les requêtes HTTP
- TailwindCSS pour le style

## 📦 Installation

1. Cloner le repository
```bash
git clone [url-du-repo]
cd ecommerce-v1
```

2. Installer les dépendances
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configuration
- Créer un fichier `.env` dans le dossier backend avec :
```
PORT=5000
MONGO_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
JWT_EXPIRE=24h
```

## 🚀 Démarrage

1. Lancer le backend
```bash
cd backend
npm run dev
```

2. Lancer le frontend
```bash
cd frontend
npm run dev
```

## 📝 API Endpoints

### Auth
- POST /api/auth/register - Inscription
- POST /api/auth/login - Connexion

### Users
- GET /api/users/profile - Profil utilisateur
- PUT /api/users/profile - Mise à jour profil
- GET /api/users - Liste des utilisateurs (admin)
- PUT /api/users/:id/role - Modification rôle (admin)

### Products
- GET /api/products - Liste des produits
- GET /api/products/:id - Détail produit
- POST /api/products - Création produit (admin)
- PUT /api/products/:id - Mise à jour produit (admin)
- DELETE /api/products/:id - Suppression produit (admin)

### Orders
- POST /api/orders - Création commande
- GET /api/orders/my-orders - Commandes utilisateur
- GET /api/orders - Toutes les commandes (admin)
- PUT /api/orders/:id - Mise à jour statut (admin)

## 👥 Structure des Rôles

### Utilisateur Standard
- Parcourir les produits
- Gérer son panier
- Passer des commandes
- Voir son historique

### Administrateur
- Gestion complète des produits
- Gestion des utilisateurs
- Gestion des commandes
- Accès au tableau de bord

## 🔒 Sécurité

- Authentification JWT
- Hachage des mots de passe
- Protection des routes sensibles
- Validation des données

## 💡 Bonnes Pratiques

- Architecture MVC
- Gestion des erreurs centralisée
- Validation des données
- Code modulaire et réutilisable
