import React, {useState} from 'react';

import ROUTES from './routes';

const Route = ({method, path, description, params, body}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`route ${open ? 'open' : ''}`}>
            <pre className="signature" onClick={event => setOpen(!open)}>{method} {path}</pre>
            {
                open
                ? <>
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
            </>
            : null}
        </div>
    );
};

const Documentation = () => {
    return (
        <aside className="documentation">
            <h3 className="section-title">Documentation</h3>
            <div className="routes">
                {ROUTES.map(({method, path, description, params, body}) => {
                    return (<Route key={`${method}${path}`}
                        method={method}
                        path={path}
                        description={description}
                        params={params}
                        body={body}/>);
                })}
            </div>
        </aside>
    );
};

export default Documentation;
