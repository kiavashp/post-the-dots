import React, {useEffect, useState} from 'react';
import Color from 'color';
import Join from './Join';
import Loading from './Loading';

const Game = ({me, board, joined, setJoined, joinGame}) => {
    if (!board) {
        return (
            <Loading/>
        );
    }

    const {size, rows, winners} = board;

    return (
        <section className="game">
            {joined && me
                ? <div className="player">
                    <div className={`score player-dot ${new Color(me.color).isLight() ? 'light': 'dark'}`}
                        style={{backgroundColor: me.color}}>
                        {me.score}
                    </div>
                    <span className="username">{me.username}</span>
                    {me.position ? <span className="position">#{me.position}</span> : null}
                </div>
                : <Join setJoined={setJoined} joinGame={joinGame}/>
            }
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