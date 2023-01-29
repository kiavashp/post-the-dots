const LOCAL_STORAGE_KEY = 'ptd_username';

class API {
    constructor() {
        this.username = localStorage.getItem(LOCAL_STORAGE_KEY) || null;
    }

    setUsername(username) {
        this.username = username;
        localStorage.setItem(LOCAL_STORAGE_KEY, username);
    }

    getUsername() {
        return this.username;
    }

    async me() {
        const result = await this.makeCall('GET', `/players/me`);

        if (result.payload) {
            this.setUsername(result.payload.username);
        }

        return result;
    }

    async join(username) {
        const result = await this.makeCall('POST', '/players/join', {
            body: {
                username: username
            }
        });

        if (result.success) {
            this.setUsername(username);
        }

        return result;
    }

    assertJoined() {
        if (!this.username) {
            throw Error('Must be joined to perform this action');
        }
    }

    async makeCall(method, path, {headers, body} = {}) {
        const {username} = this;
        const options = {
            method: method || 'GET',
            headers: Object.assign({}, headers || {})
        };

        if (body) {
            if (typeof body === 'string') {
                options.headers['Content-Type'] = 'text/plain';
                options.body = body;
            } else {
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(body);
            }
        }

        try {
            const response = await fetch(`/api${path}`, options);
            const payload = await response.json();

            return {
                success: payload ? payload.success : response.ok,
                status: response.status,
                error: payload ? payload.error : null,
                payload: payload ? payload.data : null
            };
        } catch (error) {
            console.error(error);

            return {
                success: false,
                status: 0,
                error: 'Failed to make request',
                payload: null
            };
        }
    }

    async getGameState() {
        return await this.makeCall('GET', '/game');
    }

    async mark(cell) {
        this.assertJoined();

        if (typeof cell !== 'string') {
            throw Error(`Invalid cell type (expected string, got ${typeof cell})`);
        }

        return await this.makeCall('POST', `/dots/${cell}`);
    }

    async clear(cell) {
        this.assertJoined();

        if (typeof cell !== 'string') {
            throw Error(`Invalid cell type (expected string, got ${typeof cell})`);
        }

        return await this.makeCall('DELETE', `/dots/${cell}`);
    }
}

export default new API();
