
import { Modal } from './Modal'
import React, { Component } from 'react';
import { SvgExpandMore } from './Svg'
import { BtnSpin } from './BtnSpin'
import ListViewCore from './list-view-core'

class SelectedListView extends Component {

    constructor(props) {
        super(props)

        this.state = {
            openModal: !!props.isActive || false,
            elemSize: null
        }
    }

    componentWillReceiveProps(nextProps) {
        nextProps.isActive !== undefined && this.setState({ openModal: !!nextProps.isActive })
    }

    _ref = (elem) => {
        if (!!elem) {
            if (elem.offsetParent.offsetParent) {
                var {
                    clientWidth,
                    clientHeight,
                    offsetLeft,
                    offsetTop,
                    offsetHeight,
                    offsetWidth,
                } = elem.offsetParent;
                offsetTop += elem.offsetTop
                offsetLeft += elem.offsetLeft
            }
            else {
                var {
                    clientWidth,
                    clientHeight,
                    offsetLeft,
                    offsetTop,
                    offsetHeight,
                    offsetWidth,
                } = elem;
            }
            let {
                innerWidth,
                innerHeight,
            } = window;
            this.setState({
                elemSize: { clientWidth, clientHeight, offsetLeft, offsetTop, offsetHeight, offsetWidth, innerHeight, innerWidth }
            })
        }
    }

    _refModal = (elem) => {
        //console.log(elem)
    }

    // _onSelected = (period) => {
    //     this.setState({ ...period, openModal: !this.state.openModal,  })
    //     this.props.onSelected && this.props.onSelected(period)
    // }

    _onClose = () => this.setState({ openModal: !this.state.openModal })


    _Modal = () => this.state.openModal && <div ref={this._ref} style={{ position: 'relative', color: 'initial' }} >
        {
            !!this.state.elemSize && <Modal ref={this._refModal}
            {...this.props}
            {...this.state}
            onClose={this._onClose}
        />}
    </div>

    _btnCalendarOnClick = () => {
        this.setState({
            openModal: !this.state.openModal
        })
    }

    _renderSpinButton = () => <div>
        {this.props.isButtonActive && <BtnSpin onClick={this._btnCalendarOnClick}
        ><SvgExpandMore /></BtnSpin>}
        {this._Modal()}
    </div>

    _onChangeObject = (period) => {
        this.setState({ ...period })
    }

    render() {
        return <div style={{ flex: 'auto', height: '100%', width: '100%' }}>

            {this.props.isModal ?
                this._renderSpinButton() :
                <ListViewCore {...this.props} />
            }
        </div>
    }
}

export default SelectedListView;