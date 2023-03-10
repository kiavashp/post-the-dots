const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const colors = require('./colors');

const convertCoordinates = coordinates => {
    const [_, rowLetter, column] = coordinates.match(/([a-z]+)([0-9]+)/i) || [];
    const row = rowLetter ? ALPHABET.indexOf(rowLetter.toLowerCase()) : -1;
    const converted = [row, Number(column || '-1')];

    return converted;
};

class Board {
    constructor() {
        this.players = new Map();
        this.board = this.createBoard();
    }

    createBoard(size) {
        size = Math.min(ALPHABET.length, size || 10);
        const rows = [];

        for (let r = 0; r < size; r += 1) {
            const row = [];

            for (let c = 0; c < size; c += 1) {
                row.push({
                    row: r,
                    col: c,
                    coordinates: [ALPHABET[r], c.toString()],
                    playedBy: null
                });
            }

            rows.push(row);
        }

        return {
            size,
            rows,
            winners: null,
            active: false
        };
    }

    calcBoardState() {
        const {board, players} = this;
        const cells = board.rows.flat();

        const scores = {};
        const comboCounted = new Set();
        const matrix = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1]
        ];

        cells.forEach(({row, col, coordinates, playedBy}) => {
            if (playedBy) {
                if (!scores[playedBy]) {
                    scores[playedBy] = 0;
                }

                scores[playedBy] += 1;

                for (let [r, c] of matrix) {
                    const comboCoordinates = [`${row}${col}`, `${row+r}${col+c}`];
                    const cellCheck = board.rows && board.rows[row + r] && board.rows[row + r][col + c];

                    if (cellCheck && cellCheck.playedBy === playedBy && !comboCounted.has(comboCoordinates.join(':'))) {
                        scores[playedBy] += 1;
                        comboCounted.add(comboCoordinates.join(':'));
                        comboCounted.add(comboCoordinates.reverse().join(':'));
                    }
                }
            }
        });

        for (let ip in scores) {
            const player = players.get(ip);

            player.score = scores[ip];
        }

        const hasUnplayed = cells.find(cell => !cell.playedBy);

        if (!hasUnplayed) {
            const max = {
                score: 0,
                players: []
            };

            for (let [ip, player] of players) {
                console.log(`player.score=${player.score}\nmax.score=${max.score}`);

                if (player.score > max.score) {
                    max.score = player.score;
                    max.players = [ip];
                } else if (player.score == max.score) {
                    max.players.push(ip);
                }
            }

            board.winners = max.players;
            board.active = false;
        }
    }

    assertGameActive() {
        if (!this.isActive()) {
            throw Error('Game is not active');
        }
    }

    isActive() {
        return this.board.active;
    }

    isGameOver() {
        return Boolean(this.board.winners && this.board.winners.length);
    }

    newGame(size) {
        this.players = new Map();
        this.board = this.createBoard(size);
    }

    start() {
        this.board.active = true;
    }

    getPlayer(ip) {
        return this.players.get(ip);
    }

    addPlayer(ip, username) {
        const player = {
            username,
            color: colors.next(),
            score: 0
        };

        this.players.set(ip, player);

        return player;
    }

    getBoard() {
        const {board, players} = this;
        const boardData = JSON.parse(JSON.stringify(board));

        for (let row of boardData.rows) {
            for (let cell of row) {
                if (cell.playedBy) {
                    cell.playedBy = players.get(cell.playedBy);
                }
            }
        }

        boardData.winners = boardData.winners && boardData.winners.map(ip => players.get(ip));

        return boardData;
    }

    getPlayers() {
        const {players} = this;
        const playersData = [...players.values()].map(({username, color, score}) => {
            return {username, color, score};
        });

        return playersData;
    }

    coordinatesInRange(coordinates) {
        const {board} = this;
        const [row, column] = convertCoordinates(coordinates);

        return typeof row === 'number' && typeof column === 'number' && row < board.size && column < board.size && board.rows[row] && board.rows[row][column];
    }

    mark(coordinates, ip) {
        this.assertGameActive();

        const {board} = this;
        const player = this.getPlayer(ip);
        const [row, column] = convertCoordinates(coordinates);

        if (!player) {
            throw Error(`player not found`);
        }

        if (!this.coordinatesInRange(coordinates)) {
            throw Error(`invalid coordinates specified: "${coordinates}"`);
        }

        // check if already marked by user
        const boardCell = board.rows[row][column];

        if (board.winner) {
            return {
                success: false,
                reason: 'Game is already over'
            };
        }

        if (boardCell.playedBy) {
            return {
                success: false,
                reason: `Dot already placed by ${this.players.get(boardCell.playedBy).username}`
            };
        }

        // mark if not already
        boardCell.playedBy = ip;

        // trigger board recalc
        this.calcBoardState();

        return {
            success: true
        };
    }

    clear(coordinates, ip) {
        this.assertGameActive();

        const {board} = this;
        const player = this.getPlayer(ip);
        const [row, column] = convertCoordinates(coordinates);

        if (!player) {
            throw Error(`player not found: "${username}"`);
        }

        if (!this.coordinatesInRange(coordinates)) {
            throw Error(`invalid cell specified: "${cell}"`);
        }

        // check if already marked by user
        const boardCell = board.rows[row][column];

        if (board.winner) {
            return {
                success: false,
                reason: 'Game is already over'
            };
        }

        if (!boardCell.playedBy) {
            return {
                success: false,
                reason: `No dot placed at ${coordinates}`
            };
        }

        boardCell.playedBy = null;

        // trigger board recalc
        this.calcBoardState();

        return {
            success: true
        };
    }
}

module.exports = new Board();
