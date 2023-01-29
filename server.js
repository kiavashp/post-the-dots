const {PORT=3210} = process.env;
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const server = express();
const api = require('./api');

server.use(morgan('dev'));

server.use('/api', api);

server.use(express.static(path.join(__dirname, 'build')));
server.get('/*', (request, response, next) => {
    response.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(PORT);
