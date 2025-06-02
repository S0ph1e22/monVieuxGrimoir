const express = require ('express');
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const bookRouters =  require ('./routes/book');
const userRoutes = require ('./routes/user');

mongoose.connect('mongodb+srv://sophie:22101999@cluster0.jh0mpdh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
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

app.use('/api/book', bookRouters);
app.use ('/api/auth', userRoutes);



module.exports = app;