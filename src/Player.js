import React from 'react';

import Color from 'color';

const Player = ({player, className=''}) => {
    return (
        <div className={`player ${className}`} title={player.username}>
            <div className={`score player-dot ${new Color(player.color).isLight() ? 'light': 'dark'}`}
                style={{backgroundColor: player.color}}>
                {player.score}
            </div>
            <span className="username">{player.username}</span>
            {player.position ? <span className="position">#{player.position}</span> : null}
        </div>
    );
};

export default Player;
