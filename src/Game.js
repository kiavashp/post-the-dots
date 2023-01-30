import React, {Fragment, useEffect, useState} from 'react';

import {colorClass} from './util';

import Header from './Header';
import Join from './Join';
import Player from './Player';
import Loading from './Loading';

const GameOver = ({me, winners}) => {
    return (<Fragment>
        Game Over:
        {winners
            .sort((a, b) => (b.username === me.username) - (a.username === me.username))
            .map((p, i) =>
            <Fragment key={i}>
                {i > 0 ? 'and' : ''}
                <span key={i}
                    style={{backgroundColor: p.color}}
                    className={`player-username ${colorClass(p.color)}`}>
                    {me.username === p.username ? 'You' : p.username}
                </span>
            </Fragment>
        )}
        {winners.length > 1 ? 'Tied!' : 'Won!'}
    </Fragment>);
};

const GameState = ({me, active, activatedTime, winners}) => {
    let gameStateClass = 'hide';
    let gameStateContent = '\u00A0';

    if (active) {
        if (me) {
            if (Date.now() - activatedTime < 5e3) {
                gameStateClass = 'active joined';
                gameStateContent = "Send commands to place dots!"
            }
        } else {
            gameStateClass = 'active notjoined';
            gameStateContent = "Game Active! Join below to play!";
        }
    } else if (winners && winners.length) {
        gameStateClass = 'gameover';
        gameStateContent = <GameOver me={me} winners={winners}/>;
    } else {
        gameStateClass = 'pending';
        gameStateContent = "Game starting soon...";
    }

    return (<div className={`game-state ${gameStateClass}`}>
        {gameStateContent}
    </div>);
};

const Board = ({board}) => {
    const {size, rows, winners} = board;

    return (<div className="board">
        <div className="row">
            <div className="axis-header"></div>
            {rows[0].map((_, c) => {
                return (
                    <div key={c} className="axis-header">{c}</div>
                );
            })}
        </div>
        {rows.map((row, r) => {
            return (
                <div key={r} className="row">
                    <div className="axis-header">{String.fromCharCode(97 + r)}</div>
                    {row.map((column, c) => {
                        const {playedBy} = column;

                        return (<div key={c}
                            className={`column ${playedBy ? 'player-dot' : ''}`}
                            style={playedBy ? {backgroundColor: playedBy.color} : {}}>
                        </div>)
                    })}
                </div>
            );
        })}
    </div>);
};

const Game = ({me, board, joined, setJoined, joinGame}) => {
    const [activatedTime, setActivatedTime] = useState(0);

    useEffect(() => {
        if (board && board.active) {
            setActivatedTime(Date.now());
        }
    }, [board && board.active]);

    if (!board) {
        return (
            <Loading/>
        );
    }

    return (
        <section className="game">
            <Header/>
            <GameState me={me} active={board.active} activatedTime={activatedTime} winners={board.winners}/>
            <Board board={board}/>
            {joined && me
                ? <Player player={me}/>
                : <Join setJoined={setJoined} joinGame={joinGame}/>}
        </section>
    );
};

export default Game;
