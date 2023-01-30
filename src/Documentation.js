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
            <div className="content">
                <div className="routes">
                    <h3 className="section-title">Routes</h3>
                    {ROUTES.map(({method, path, description, params, body}) => {
                        return (<Route key={`${method}${path}`}
                            method={method}
                            path={path}
                            description={description}
                            params={params}
                            body={body}/>);
                    })}
                </div>
                <div className="scoring">
                    <h3 className="section-title">Scoring</h3>
                    <p>+1 point per dot</p>
                    <i><strong>Bonus:</strong> +1 extra point for every connected pair (horizontal or vertical)</i>
                </div>
            </div>
        </aside>
    );
};

export default Documentation;
