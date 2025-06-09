const express = require ('express');
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require ('path');

const bookRouters =  require ('./routes/book');
const userRoutes = require ('./routes/user');

mongoose.connect(process.env.DB_URI)
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

const app = express();

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(cors());

app.use('/api/books', bookRouters);
app.use ('/api/auth', userRoutes);
app.use ('/images', express.static (path.join(__dirname,'images')))

module.exports = app;