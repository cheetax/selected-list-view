import React from 'react';
import './btnSpin.css'

const _input = ({ size, className }) => <input
    type='url'
    readOnly
    style={{ height: size, width: size }}
    //value=''
    className={(() => className)()} />

const BtnSpin = ({ onClick, children, className = '', size = 32 }) => <div className={(() => 'btn-spin browser-default ' + className)()}
    style={{ height: size, width: size }}
    onClick={onClick ? (event) => onClick(event) : null}>
    {_input({size, className: 'btn-spin browser-default ' + className})}
    {children}</div>

const BtnFlat = ({ onClick, children, className = '', size = 32 }) => <div className={(() => 'btn-flat browser-default ' + className)()}
    style={{ height: size, width: size }}
    onClick={onClick ? (event) => onClick(event) : null}>
    {_input({size, className: 'btn-flat browser-default ' + className})}
    {children}</div>    

export {
    BtnSpin,
    BtnFlat
}