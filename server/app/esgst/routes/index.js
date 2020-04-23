const { Router } = require('express');
const Game = require('./games/Game');
const Games = require('./games/Games');
const Rcv = require('./games/Rcv');
const Uh = require('./users/Uh');

const routes = Router();

routes.get('/esgst/game/:type/:id', Game.get);
routes.get('/esgst/games', Games.get);
routes.get('/esgst/games/rcv', Rcv.get);
routes.get('/esgst/user/\\+:steamid/uh', Uh.get);
routes.get('/esgst/users/uh', Uh.get);

module.exports = routes;