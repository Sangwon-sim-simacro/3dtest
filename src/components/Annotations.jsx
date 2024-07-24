import { React, useState } from 'react';


export const Annotation = ({ title, description }) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div>
            <div className="label" onMouseOut={() => setIsActive(!isActive)} onMouseOver={() => setIsActive(!isActive)}>{title} </div>
            {isActive && <div className="annotationDescription" dangerouslySetInnerHTML={{ __html: description }} onClick={() => setIsActive(!isActive)}></div>}
        </div>
    );
};


