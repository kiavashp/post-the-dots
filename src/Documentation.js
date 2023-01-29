import React from 'react';

import ROUTES from './routes';

const Documentation = () => {
    return (
        <aside className="documentation">
            <h3 className="section-title">Documentation</h3>
            <div className="routes">
                {ROUTES.map(({method, path, description, params, body}) => {
                    return (
                        <div key={`${method}${path}`} className="route">
                            <pre className="signature">{method} {path}</pre>
                            <i className="description">{description}</i>
                            {params
                                ? <div className="url-parameters">
                                    {params.map(({name, description}) => {
                                        return (
                                            <div key={name} className="parameter">
                                                <span className="name">{name}</span>
                                                {" - "}
                                                <span className="description">{description}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            : null}
                            {body
                                ? <div className="body-parameters">
                                    {body.map(({name, description}) => {
                                        return (
                                            <div key={name} className="body-parameter">
                                                <span className="name">{name}</span>
                                                {" - "}
                                                <span className="description">{description}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            : null}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default Documentation;
