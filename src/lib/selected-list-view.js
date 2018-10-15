
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
            elemSize: null,
            elemSpin: null
        }
    }

    componentWillReceiveProps(nextProps) {
       nextProps.isActive !== undefined && this.setState({ openModal: !!nextProps.isActive })
       // this.forceUpdate()
    }

    _ref = (elem) => {
        if (!!elem) {
            if (elem.offsetParent.offsetParent) {
                var {
                    clientHeight,
                    offsetLeft,
                    offsetTop,
                    offsetHeight,
                    clientWidth,
                    offsetWidth,
                } = elem.offsetParent;
                offsetTop += elem.offsetParent.offsetHeight
                clientWidth = this.props.isField && elem.offsetParent.offsetWidth
                offsetLeft += !this.props.isField && elem.offsetLeft || 0;
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
                offsetLeft += this.state.elemSpin.clientWidth;
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

    _refSpin = (elem) => {
        elem && this.setState({ elemSpin: elem })
    }

    // _onSelected = (period) => {
    //     this.setState({ ...period, openModal: !this.state.openModal,  })
    //     this.props.onSelected && this.props.onSelected(period)
    // }

    _onClose = () => this.setState({ openModal: !this.state.openModal })


    _Modal = () => this.state.openModal && <div  ref={this._ref} style={{ position: 'relative', color: 'initial' }} >
        {
            !!this.state.elemSize && <Modal
                {...this.props}
                {...this.state}
                onClose={this._onClose}
            />}
    </div>

    _btnOnClick = () => {
        this.setState({
            openModal: !this.state.openModal
        })
    }

    _renderSpinButton = () => <div  >
        {this.props.isButtonActive && <div style={{display: 'inline-block'}} ref={this._refSpin} >
            <BtnSpin  onClick={this._btnOnClick}
            ><SvgExpandMore /></BtnSpin>
        </div>}
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