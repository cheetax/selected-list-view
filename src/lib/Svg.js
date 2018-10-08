import React from 'react';

const Svg = ({ children }) => <svg xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', fill: '#013a81' }}
    width="24"
    height="24"
    viewBox="0 0 24 24">{children}</svg>

const SvgPlus = () => <Svg><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></Svg>

const SvgMinus = () => <Svg ><path d="M19 13H5v-2h14v2z" /></Svg>

const SvgCalendar = () => <Svg ><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" /></Svg>

const SvgArrowLeft = () => <Svg><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></Svg>

const SvgArrowRight = () => <Svg><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></Svg>

const SvgArrowDown = () => <Svg><path d="M7 10l5 5 5-5z" /></Svg>

const SvgDateRange = () => <Svg><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></Svg>

const SvgCenterFocus = () => <Svg  ><path d="M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></Svg>

export {
    SvgPlus,
    SvgMinus,
    SvgCalendar,
    SvgArrowLeft,
    SvgArrowRight,
    SvgArrowDown,
    SvgCenterFocus,
    SvgDateRange
}