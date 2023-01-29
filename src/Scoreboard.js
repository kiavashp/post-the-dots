import React, {useEffect, useState} from 'react';
import Color from 'color';
import api from './api';
import Loading from './Loading';

const Scoreboard = ({players}) => {
    if (!players) {
        return (
            <Loading/>
        );
    }

    const playerUsername = api.getUsername();

    return (
        <aside className="scoreboard">
            <h3 className="section-title">Scoreboard</h3>
            <div className="players">
                {players.map((player, p) => {
                    return (
                        <div key={p} className={`player ${playerUsername === player.username ? 'me' : ''}`}>
                            <div className={`score player-dot ${new Color(player.color).isLight() ? 'light': 'dark'}`}
                                style={{backgroundColor: player.color}}>
                                {player.score}
                            </div>
                            <span className="username">{player.username}</span>
                            {player.position ? <span className="position">#{player.position}</span> : null}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default Scoreboard;
