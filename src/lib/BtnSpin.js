import React from 'react';

const BtnPeriod = ({ onClick, onFocus, children }) => <div className='btn-spin browser-default'
    onClick={onClick ? (event) => onClick(event) : null}>
    <input
        type='url'
        readOnly
        className='btn-spin browser-default'>
    </input>{children}</div>

export {
    BtnPeriod,
}