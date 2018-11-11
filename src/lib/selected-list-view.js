
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
            openModal: false,
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

    _onClose = () => {
        this.setState({
            openModal: false
        })
        setTimeout(() => this.setState({
            openModalFlex: false,
            openModalExpand: false
        }), 300)
    }


    _Modal = (openFlex) => <div ref={this._ref} style={{ position: 'relative', color: 'initial' }} >
        {
            !!this.state.elemSize && <Modal
                {...this.props}
                {...this.state}
                items={(!openFlex && this.props.itemsQuickSelection) ? this.props.itemsQuickSelection : this.props.items}
                Height={(openFlex || !this.props.itemsQuickSelection) && this.props.Height}
                headerRenderer={openFlex && this.props.headerRenderer}
                openFlex={openFlex}
                onClose={this._onClose}
            >{(!openFlex && !this.props.isButtonMore) && <div style={{ flex: 'auto', display: 'flex', justifyContent: 'flex-end' }} >{this._btnSpinMore()}</div>}</Modal>}
    </div>

    _btnOnClick = (status) => {
        this.setState({
            openModalFlex: status,
            openModalExpand: !status,
            openModal: true,
            openFlex: status
        })
    }

    _btnSpinMore = () => {
        return <BtnSpin onClick={() => this._btnOnClick(true)}><SvgMoreHoriz /></BtnSpin>
    }

    _renderSpinButton = () => <div  >
        {(this.props.isButtonExpand || this.props.isButtonMore) && <div style={{ display: 'flex' }} ref={this._refSpin}>
            {this.props.isButtonMore && <div>
                {this._btnSpinMore()}
            </div>}
            {this._Modal(true)}
            {this.props.isButtonExpand && <div>
                <BtnSpin onClick={() => this._btnOnClick(false)}><SvgExpandMore /></BtnSpin>
                {this._Modal(false)}
            </div>}
        </div>}
    </div>

    _onChangeObject = (item) => {
        this.setState({ ...item })
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