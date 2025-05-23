const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Configuration CORS détaillée
app.use(cors({
  origin: 'http://localhost:5173', // URL de votre frontend Vite
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Log des requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Connexion MongoDB avec plus de logs
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connecté à MongoDB avec succès');
})
.catch(err => {
  console.error('❌ Erreur de connexion à MongoDB:', err);
  process.exit(1);
});

// Modèle User
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionne correctement' });
});

// Route temporaire pour lister les utilisateurs (À SUPPRIMER EN PRODUCTION)
app.get('/api/users/debug', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclure les mots de passe
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route temporaire pour créer un utilisateur test (À SUPPRIMER EN PRODUCTION)
app.post('/api/users/create-test', async (req, res) => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: 'fatima@gmail.com' });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur test existe déjà' });
    }

    // Créer l'utilisateur test
    const testUser = new User({
      email: 'fatima@gmail.com',
      password: '1234',
      firstname: 'fatima',
      lastname: 'azzimani',
      role: 'admin'
    });

    await testUser.save();
    res.status(201).json({ message: 'Utilisateur test créé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur test:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route de login avec plus de logs
app.post('/api/auth/login', async (req, res) => {
  console.log('📧 Tentative de connexion pour:', req.body.email);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Données manquantes');
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Pour cet exemple, on compare directement le mot de passe
    if (password !== user.password) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    console.log('✅ Connexion réussie pour:', email);

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'votre_secret_jwt',
      { expiresIn: '24h' }
    );

    // Envoyer la réponse
    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur de connexion au serveur' });
  }
});

// Route d'inscription
app.post('/api/auth/register', async (req, res) => {
  console.log('📝 Tentative d\'inscription:', req.body);
  
  try {
    const { email, password, firstname, lastname } = req.body;

    // Validation des données
    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer le nouvel utilisateur
    const newUser = new User({
      email,
      password, // Note: Dans un environnement de production, il faudrait hasher le mot de passe
      firstname,
      lastname,
      role: 'user' // Par défaut, les nouveaux utilisateurs ont le rôle 'user'
    });

    await newUser.save();
    console.log('✅ Inscription réussie pour:', email);

    // Créer le token JWT
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      'votre_secret_jwt',
      { expiresIn: '24h' }
    );

    // Envoyer la réponse
    res.status(201).json({
      user: {
        id: newUser._id,
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        role: newUser.role
      },
      token
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
}); 