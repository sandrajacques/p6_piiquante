const http = require('http');//utilisation du server http de nodeJs

const dotenv = require("dotenv").config();//utilisation des variables d'environnement, en mode developpement(fichier .env), pour plus de sécurité(mdp,URI).

const app = require('./app');//inclure app.js

const normalizePort = val => {//routine pour normaliser le numero du port pour davantage de stabilité
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = process.env.PORT || normalizePort('3000');//choisir le port d'écoute ou depuis les variables d'environnement sinon le port 3000
app.set('port', port);//port définir le port sur laquelle l'application va s'executer

const errorHandler = error => {//routine pour gérer d'éventuelles erreurs d'éxecution
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' autorisation insufisante.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' déja utilisé.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Server en écoute sur le  ' + bind);
});

server.listen(port);
