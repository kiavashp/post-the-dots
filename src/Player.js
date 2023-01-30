import React from 'react';

import {colorClass} from './util';

const Player = ({player, className=''}) => {
    return (
        <div className={`player ${className}`} title={player.username}>
            <div className={`score player-dot ${colorClass(player.color)}`}
                style={{backgroundColor: player.color}}>
                {player.score}
            </div>
            <span className="username">{player.username}</span>
            {player.position ? <span className="position">#{player.position}</span> : null}
        </div>
    );
};

export default Player;
