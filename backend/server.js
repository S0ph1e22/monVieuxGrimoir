require('dotenv').config();

const http = require('http');
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {  //si ce n'est pas un nb, retourne la valeur brut
    return val;
  }
  if (port >= 0) { //si c'est un num de port valide (>=0), retourne ce num
    return port;
  }
  return false; //sinon retourne false
};

const port = normalizePort(process.env.PORT ||'4000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error; // si l'erreur n'est pas lié a l'écoute du serveur, on l'a relance
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES': //le port est reservé, il faut des droits admin
      console.error(bind + ' requires elevated privileges.'); //on affiche le msg d'erreur
      process.exit(1);  //on quitte le process
      break;
    case 'EADDRINUSE': //le port est déja utilisé par un autre programme
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error; //sinon on relance l'erreur
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
//lorsque l'on commance a écouté, on récup l'adresse (port ou pipe) et on affiche un message de confirmation
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); //on lance l'écoute du serveur sur le port défini