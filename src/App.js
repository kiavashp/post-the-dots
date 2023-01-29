import React, {useState, useEffect} from 'react';

import api from './api';
import {rankPlayers} from './util';

import Documentation from './Documentation';
import Game from './Game';
import Scoreboard from './Scoreboard';
import Command from './Command';
import Loading from './Loading';

const App = () => {
    const [joined, setJoined] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [board, setBoard] = useState(null);
    const [players, setPlayers] = useState([]);
    const me = players.find(player => player.username === api.getUsername());

    const reload = async () => {
        console.log('reload()');

        const {payload: {board, players}} = await api.getGameState();

        setLoaded(true);
        setBoard(board);
        setPlayers(rankPlayers(players));
    };

    const joinGame = async (username) => {
        const result = await api.join(username);

        console.log(`api.join("${username}")`, result);

        setJoined(result.success);
        reload();
    };

    useEffect(() => {
        reload()
        const interval = setInterval(() => reload(), 1e3);
        return () => clearInterval(interval);
    }, [joined]);

    return (<>
        <main>
            <Documentation/>
            <Game me={me} board={board} reload={reload} joined={joined} setJoined={setJoined} joinGame={joinGame}/>
            <Scoreboard players={players}/>
        </main>
        {joined ? <Command reload={reload}/> : null}
    </>);
};

export default App;
