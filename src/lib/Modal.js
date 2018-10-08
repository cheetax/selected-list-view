import React, { Component } from 'react'
import SelectPeriodCore from './select-period-core';
import './Modal.css'
import './select-period-core.css';

const ClassModal = ({ openModal }) => openModal ? 'modal-dialog-button active' : 'modal-dialog-button'

const ClassModalOverlay = ({ openModal }) => '' //openModal ? 'modal-dialog-overlay active' : 'modal-dialog-overlay'

const positiveNum = (num) => num < 0 ? 0 : num

//export const Modal = (props) => {
export class Modal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            clientHeight: 0,
            clientWidth: 0,
            elem: null
        }
    }

    _ref = (elem) => {
        this.setState({ elem })
    }

    componentDidUpdate(prevProps, prevState, snap) {
        if (this.state.elem) {
            let props = this.props
            let left = (props.elemSize) && positiveNum(props.elemSize.offsetLeft - this.state.elem.clientWidth) + 'px' || 0
            let top = (props.elemSize) && ((props.elemSize.offsetTop < (props.elemSize.innerHeight - this.state.elem.clientHeight)) ? props.elemSize.offsetTop : positiveNum(props.elemSize.innerHeight - this.state.elem.clientHeight)) + 'px' || 0;
            (this.state.left !== left || this.state.top !== top) && this.setState({ left, top })
        }
    }

    _style = () => {
        return {
            cursor: 'default',
            left: this.state.left,
            top: this.state.top,
            width: '560px',
            height: '495px'
        }
    }

    render() {
        const openModal = this.props.openModal
        return <div>
            {this.props.elemSize && <div className={ClassModalOverlay({ openModal })} >
                <div ref={this._ref} style={this._style()} className={ClassModal({ openModal })} >
                    <SelectPeriodCore {...this.props} />
                </div>
            </div>}

        </div>
    }
}
