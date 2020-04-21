const { Router } = require('express');
const Game = require('./games/Game');
const Games = require('./games/Games');
const Rcv = require('./games/Rcv');

const routes = Router();

routes.get('/esgst/game/:type/:id', Game.get);
routes.get('/esgst/games', Games.get);
routes.get('/esgst/games/rcv', Rcv.get);

module.exports = routes;