import React from 'react'

export const Btn = ({ onClick, children, style, className = '' }) => {
    let _className = 'btn-select-day ' + className;
    return <a
        className={_className}
        onClick={onClick}
        style={{
            height: 32,
            width: 32,
            margin: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...style,
        }}>{children}</a>
}