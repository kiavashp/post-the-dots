import React, {useState} from 'react';
import api from './api';

const HTTP_METHODS = {
    'GET': true,
    'POST': true,
    'PATCH': true,
    'DELETE': true
};

const Command = ({board, reload}) => {
    const [command, setCommand] = useState('');
    const [error, setError] = useState(null);

    const handleCommand = async (event) => {
        event.preventDefault();

        const clean = command.trim().replace(/\s+/, ' ').toLowerCase();

        const [method, path] = clean.split(' ');

        if (method.startsWith('/')) {
            return setError(`Missing HTTP Method. Please type a command in the form of "METHOD /path" (e.g. "GET /some/route")`);
        }

        if (!(method.toUpperCase() in HTTP_METHODS)) {
            return setError(`Invalid HTTP Method: ${method.toUpperCase()} (must be one of: ${Object.keys(HTTP_METHODS).join(', ')})`);
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
            reload();
            setCommand('');
        }
    };

    return (
        <section className="command">
            <div className="command-header">
                <h3 className="section-title">Commands</h3>
                <div className={`command-error ${error ? '' : 'hide'}`}>{error}</div>
            </div>
            <form onSubmit={handleCommand}>
                <input className="command-input"
                    disabled={board.winners && board.winners.length > 0}
                    type="text"
                    size="60"
                    placeholder="METHOD /path/to/endpoint"
                    value={command}
                    onChange={event => setCommand(event.target.value)}
                    required={true}
                    autoComplete="off"/>
                <button className="command-send"
                    disabled={board.winners && board.winners.length > 0}>Send</button>

            </form>
        </section>
    );
};

export default Command;
