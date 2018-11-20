import React from 'react';
import './BtnSpin.css'

const BtnSpin = ({ onClick, children, className = '', size = 32 }) => <div className={(() => 'btn-spin browser-default ' + className)()}
    style={{ height: size, width: size }}
    onClick={onClick ? (event) => onClick(event) : null}>
    <input
        type='url'
        readOnly
        style={{ height: size, width: size }}
        //value=''
        className={(() => 'btn-spin browser-default ' + className)()}>
    </input>{children}</div>

export {
    BtnSpin,
}