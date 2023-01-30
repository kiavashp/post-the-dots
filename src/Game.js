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

const GameState = ({me, active, activatedTime, winners}) => {
    return (<div className="game-state">
        {active
            ? (me ? (Date.now() - activatedTime < 3e3 ? "Play!" : " ") : "Join to play!")
            : winners && winners.length
                ? <GameOver me={me} winners={winners}/>
                : "Game will start soon..."}
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

    const {size, rows, winners} = board;

    return (
        <section className="game">
            <Header/>

            {joined && me
                ? <Player player={me}/>
                : <Join setJoined={setJoined} joinGame={joinGame}/>
            }

            <GameState me={me} active={board.active} activatedTime={activatedTime} winners={board.winners}/>

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
