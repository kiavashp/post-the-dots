const PARAMS = {
    coordinates: {
        name: 'coordinates',
        description: 'e.g. "c3" for row "c", column "3"'
    }
};

const BODY = {

};

const ROUTES = [
    {
        method: 'POST',
        path: '/dots/:coordinates',
        description: 'Place a dot (spot must be empty)',
        params: [
            PARAMS.coordinates
        ],
        body: null
    },
    {
        method: 'DELETE',
        path: '/dots/:coordinates',
        description: 'Remove a dot (by any player)',
        params: [
            PARAMS.coordinates
        ],
        body: null
    }
];

export default ROUTES;
