const {PORT=3210} = process.env;
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const server = express();
const api = require('./api');

server.enable('trust proxy');

server.use(morgan('short'));

server.get('/health', (request, response, next) => {
    response.status(200).send();
});

server.use('/api', api);

server.use(express.static(path.join(__dirname, 'build')));
server.get('/*', (request, response, next) => {
    response.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(PORT);
