import React, {useEffect, useState} from 'react';
import api from './api';
import Loading from './Loading';

const Join = ({setJoined, joinGame}) => {
    const [username, setUsername] = useState(api.getUsername() || '');
    const [error, setError] = useState(null);

    useEffect(() => {
        api.me().then(({payload: me}) => {
            if (me) {
                if (!username) {
                    setUsername(me.username);
                    api.setUsername(me.username);
                }

                setJoined(true);
            }
        });
    }, []);

    const handleJoin = async (event) => {
        event.preventDefault();

        if (!username) {
            setError('Must specify username to join.');
        }

        const {payload: me} = await api.me();

        if (me && me.username === username) {
            setJoined(true);
        } else { // if not joined or joined as another username
            await joinGame(username);
        }
    };

    return (<section className="join">
        <form onSubmit={handleJoin}>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={event => setUsername(event.target.value)}
                required={true}
                size={16}
                maxLength={16}
                autoComplete="off"/>
            <button>Join</button>
        </form>
    </section>);
};

export default Join;
