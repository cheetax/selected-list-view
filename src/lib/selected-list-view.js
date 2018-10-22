
import { Modal } from './Modal'
import React, { Component } from 'react';
import { SvgExpandMore, SvgMoreHoriz } from './Svg'
import { BtnSpin } from './BtnSpin'
import ListViewCore from './list-view-core'
import './selected-list-view-core.css'

class SelectedListView extends Component {

    constructor(props) {
        super(props)

        this.state = {
            openModalFlex: false,
            openModalExpand: false,
            elemSize: null,
            elemSpin: null
        }
    }

    // componentWillReceiveProps(nextProps) {
    //    nextProps.isActiveExpand !== undefined && this.setState({ openModalExpand: !!nextProps.isActiveExpand })
    //    // this.forceUpdate()
    // }

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
                offsetLeft += !this.props.isField ? elem.offsetLeft : 0;
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

    _onClose = () => this.setState({
        openModalFlex: false,
        openModalExpand: false
    })


    _Modal = (openFlex) => <div ref={this._ref} style={{ position: 'relative', color: 'initial' }} >
        {
            !!this.state.elemSize && <Modal
                {...this.props}
                {...this.state}
                openFlex={openFlex}
                onClose={this._onClose}
            />}
    </div>

    _btnOnClick = (status) => {
        this.setState({
            openModalFlex: status,
            openModalExpand: !status,
            openFlex: status
        })
    }

    _renderSpinButton = () => <div  >
        {(this.props.isButtonExpand || this.props.isButtonMore) && <div style={{ display: 'flex' }} ref={this._refSpin}>
            {this.props.isButtonMore && <div>
                <BtnSpin onClick={() => this._btnOnClick(true)}><SvgMoreHoriz /></BtnSpin>
                {this._Modal(true)}
            </div>
            }
            {this.props.isButtonExpand && <div>
                <BtnSpin onClick={() => this._btnOnClick(false)}><SvgExpandMore /></BtnSpin>
                {this._Modal(false)}
            </div>}
        </div>}
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