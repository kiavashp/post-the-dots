const express = require('express');
const api = express.Router();
const board = require('./lib/board');

const wrap = (error, data) => {
    return {
        success: error ? false : true,
        error: error || null,
        data: data || null
    }
};

const requireGameActive = (request, response, next) => {
    if (board.isGameOver()) {
        response.status(403).send(wrap('Game is over'));
    } else {
        next();
    }
};

api.use(express.json());

// game state
api.get('/game', (request, response, next) => {
    response.send(wrap(null, {
        board: board.getBoard(),
        players: board.getPlayers()
    }));
});

// players
api.get('/players/me', (request, response, next) => {
    response.send(wrap(null, board.getPlayer(request.ip)));
});

api.post('/players/join', (request, response, next) => {
    const {username} = request.body;

    if (!username) {
        return response.status(400).send(wrap('No username specified'));
    }

    const player = board.addPlayer(request.ip, username);

    response.send(wrap(null, player));
});

// dots
api.post('/dots/:coordinates', requireGameActive, (request, response, next) => {
    const {ip} = request;
    const {coordinates} = request.params;

    if (!board.coordinatesInRange(coordinates)) {
        return response.status(400).send(wrap(`Coordinates ${coordinates} do not exist on board`))
    }

    const result = board.mark(coordinates, ip);

    response.status(201).send(wrap(result.reason));
});

api.delete('/dots/:coordinates', requireGameActive, (request, response, next) => {
    const {ip} = request;
    const {coordinates} = request.params;

    if (!board.coordinatesInRange(coordinates)) {
        return response.status(400).send(wrap(`Coordinates ${coordinates} do not exist on board`))
    }

    const result = board.clear(coordinates, ip);

    response.status(200).send(wrap(result.reason));
});

// admin
api.post('/admin/newgame', (request, response, next) => {
    if (request.body["I'M THE ADMIN NOW."] === true) {
        board.newGame();
        response.status(201).send(wrap());
    } else {
        response.status(403).send(wrap('Must be an admin to start a new game'));
    }
});

// 404 handler
api.use('*', (request, response, next) => {
    response.status(404).send(wrap('Route Not Found'));
});

// error handler
api.use((error, request, response, next) => {
    console.log(`Internal Server Error:`, error);
    response.status(500).send(wrap(error.message));
});

module.exports = api;
