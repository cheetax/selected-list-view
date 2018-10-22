import React, { Component } from 'react'
import ListViewCore from './list-view-core';
import './Modal.css'
const ClassModal = ({ openModalFlex, openModalExpand, openFlex }) => (((openFlex) ? 'modal-dialog-flex ' + ((openModalFlex) ? 'active': '') : 'modal-dialog-button ' + ((openModalExpand) ? 'active': '')) )

const ClassModalOverlay = ({ openModal, openFlex }) => (openFlex) && ((openModal) ? 'modal-dialog-overlay active' : 'modal-dialog-overlay')

const positiveNum = (num) => num < 0 ? 0 : num

//export const Modal = (props) => {
export class Modal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            clientHeight: props.Height || 'auto',
            clientWidth: props.isField && props.elemSize.clientWidth || props.Width || 560,
            elem: null
        }
    }

    _ref = (elem) => {
        this.setState({ elem })
    }

    componentDidUpdate(prevProps, prevState, snap) {
        if (this.state.elem && !this.props.openFlex) {
            let props = this.props
            let left = (props.elemSize) && positiveNum(props.elemSize.offsetLeft - this.state.elem.clientWidth) + 'px' || 0
            let clientWidth = props.Width && props.Width || this.state.clientWidth;
            let clientHeight = props.Height && props.Height || this.state.clientHeight;
            if (props.isField) {
                left = props.elemSize.offsetLeft
                clientWidth = props.elemSize.clientWidth
            }
            let top = (props.elemSize) && ((props.elemSize.offsetTop < (props.elemSize.innerHeight - this.state.elem.clientHeight)) ? props.elemSize.offsetTop : positiveNum(props.elemSize.innerHeight - this.state.elem.clientHeight)) + 'px' || 0;
            (this.state.left !== left || this.state.top !== top) && this.setState({ left, top, clientHeight, clientWidth })
        }
    }

    _style = () => {
        return !this.props.openFlex ? {
            cursor: 'default',
            left: this.state.left,
            top: this.state.top,
            width: this.state.clientWidth,
            height: this.state.clientHeight && this.state.clientHeight,
            boxSizing: 'content-box'
        } : {
                cursor: 'default',
                left: this.state.left,
                width: this.state.clientWidth,
                height: this.state.clientHeight,
            }
    }

    render() {
        const openModalFlex = this.props.openModalFlex
        const openModalExpand = this.props.openModalExpand
        const openFlex = this.props.openFlex
        return <div className={ClassModalOverlay({ openModal: openModalFlex, openFlex })}
        >
            {this.props.elemSize && <div ref={this._ref} style={this._style()} className={ClassModal({ openModalFlex, openModalExpand, openFlex })} >
                <ListViewCore {...this.props} />
            </div>}

        </div>
    }
}
