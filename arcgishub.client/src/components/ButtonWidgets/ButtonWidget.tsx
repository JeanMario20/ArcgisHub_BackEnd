import React from 'react';

interface ButtonProps {
    onClick: () => void;
    buttonClass: string;
    svgClass:string
    d: string;
    viewBox: string;
}

const ButtonWidget: React.FC<ButtonProps> = ({ onClick, buttonClass, svgClass, d, viewBox }) => {
    return (
        <button onClick={onClick} className={buttonClass}>
            <svg className={svgClass} viewBox={viewBox}>
                <path d={d}/>
            </svg>
        </button>
    )
}

export default ButtonWidget;