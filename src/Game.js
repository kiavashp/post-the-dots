import React, {Fragment, useEffect, useState} from 'react';
import Color from 'color';

import Header from './Header';
import Join from './Join';
import Player from './Player';
import Loading from './Loading';

const GameOver = ({me, winners}) => {
    return (<Fragment>
        Game Over:
        {winners.map((p, i) =>
            <Fragment key={i}>
                {i > 0 ? 'and' : ''}
                <span key={i} className="player-username">{me.username === p.username ? 'You' : p.username}</span>
            </Fragment>
        )}
        {winners.length > 1 ? 'Tied!' : 'Won!'}
    </Fragment>);
};

const Game = ({me, board, joined, setJoined, joinGame}) => {
    if (!board) {
        return (
            <Loading/>
        );
    }

    const {size, rows, winners} = board;

    return (
        <section className="game">
            <Header/>

            {joined && me
                ? <Player player={me}/>
                : <Join setJoined={setJoined} joinGame={joinGame}/>
            }

            <div className="notice">
                {board.winners && board.winners.length
                    ? <GameOver winners={board.winners} me={me}/>
                    : null}
            </div>

            <div className="board">
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
            </div>
        </section>
    );
};

export default Game;
