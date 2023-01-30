import React, {useState, useEffect} from 'react';
import api from './api';

const HTTP_METHODS = {
    'GET': true,
    'POST': true,
    'PATCH': true,
    'DELETE': true
};

const Command = ({board, reload}) => {
    const [commandHistory, setCommandHistory] = useState([]);
    const [commandsBack, setCommandsBack] = useState(0);
    const [nextCommand, setNextCommand] = useState('');
    const [command, setCommand] = useState('');
    const [error, setError] = useState(null);
    const isAdmin = api.isAdmin();

    useEffect(() => {
        if (commandsBack === 0) {
            setCommand(nextCommand);
        } else {
            setCommand(commandHistory.at(-commandsBack));
        }
    }, [commandsBack]);

    const handleKeyDown = (event) => {
        if (!isAdmin || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) {
            return;
        }

        event.preventDefault();

        if (event.key === 'ArrowUp' && commandsBack < commandHistory.length) {
            setCommandsBack(commandsBack + 1);
        } else if (event.key === 'ArrowDown' && commandsBack > 0) {
            setCommandsBack(commandsBack - 1);
        }

        console.log(`commandHistory`, commandsBack, commandHistory);
    };

    const handleCommand = async (event) => {
        event.preventDefault();

        const clean = command.trim().replace(/\s+/, ' ');

        const [method, path] = clean.split(' ');

        if (method.startsWith('/')) {
            return setError(`Missing HTTP Method. Please type a command in the form of "METHOD /path" (e.g. "GET /some/route")`);
        }

        if (!(method.toUpperCase() in HTTP_METHODS)) {
            return setError(`Invalid HTTP Method: ${method.toUpperCase()} (must be one of: ${Object.keys(HTTP_METHODS).join(', ')})`);
        }

        if (!path) {
            return setError('Missing url path. Please type a command in the form of "METHOD /path" (e.g. "GET /some/route")');
        }

        setCommandHistory(prev => [...prev, clean]);

        if (commandsBack) {
            setCommandsBack(0);
        }

        try {
            const result = await api.makeCall(method, path);

            console.log(`api: ${method.toUpperCase()} ${path}`, result);

            if (!result.success || result.error) {
                return setError(`Error (${result.status}): ${result.error}`);
            }

            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setNextCommand('');
            setCommand('');
            reload();
        }
    };

    const disableCommands = isAdmin ? false : !board.active;

    return (
        <section className="command">
            <div className="command-header">
                <h3 className="section-title">Commands{isAdmin ? '(admin)' : ''}</h3>
                <div className={`command-error ${error ? '' : 'hide'}`}>{error}</div>
            </div>
            <form onSubmit={handleCommand}>
                <input className="command-input"
                    disabled={disableCommands}
                    type="text"
                    size="60"
                    placeholder="METHOD /path/to/endpoint"
                    value={command}
                    onChange={event => {
                        setCommand(event.target.value);
                        setNextCommand(event.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    required={true}
                    autoComplete="off"/>
                <button className="command-send"
                    disabled={disableCommands}>Send</button>
            </form>
        </section>
    );
};

export default Command;
