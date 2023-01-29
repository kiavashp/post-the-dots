import React, {useEffect, useState} from 'react';
import api from './api';

import Player from './Player';
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
                    return (<Player key={p}
                        player={player}
                        className={playerUsername === player.username ? 'me' : ''}/>);
                })}
            </div>
        </aside>
    );
};

export default Scoreboard;
