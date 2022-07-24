
const express = require('express');//Bibliothèque de la base de l'API
const path = require('path');//Bibliothèque pour gérer l'accès aux dossiers sur le server
const mongoose = require('mongoose');//Bibliothèque de la gestion de la connection avec MongoDB

const Sauce = require('./models/sauce');//modèles qui défini la structure d'une sauce
//Les routes qui vont associer les requêtes http du frontend avec des actions sur les controlleurs 
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');



mongoose.connect(process.env.MONGO_URI, //connection à la BDD 
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();//commencer une API express

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//autoriser l'accès à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//autoriser tout type de Headers depuis le frontend
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//Autoriser tous ces types de requêtes
    next();
  });
app.use(express.json());//extraire le contenu json des reqûetes du frontend
app.use('/api/sauces', saucesRoutes);//utilisation du router saucesRoutes
app.use('/api/auth', userRoutes);//utilisation du router userRoutes
app.use('/images', express.static(path.join(__dirname, 'images')));//utilisation des ressources statiques (qui ne sont pas des données img ou pdf) depuis le dossier images 

module.exports = app;

