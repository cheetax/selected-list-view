
import { Modal } from './Modal'
import React, { Component } from 'react';
import { SvgExpandMore, SvgMoreHoriz } from './Svg';
import { BtnSpin } from './BtnSpin'
import ListViewCore from './list-view-core'
import './selected-list-view-core.css'

class SelectedListView extends Component {

    constructor(props) {
        super(props)
        var items = !Array.isArray(props.items) ? this._mapToArray({ items: props.items }) : props.items
        this.state = {
            items,
            openModalFlex: props.isActive || false,
            openModalExpand: false,
            openModal: props.isActive || false,
            elemSize: null,
            elemSpin: null
        }
    }

    _mapToArray = ({ items = new Map(), groupLevel = 0 }) => {
        var result = []
        //let level = groupLevel 
        items.forEach((item, key) => {
            //console.log(Object.prototype.toString.call(item), item)
            if (Object.prototype.toString.call(item) !== "[object Map]") {
                // console.log('1',item, key)
                result.push({ isGroup: true, groupLevel, item: key });
                if (Array.isArray(item)) result.push(...item.map(item => ({ item, isGroup: false })));
            }
            else {
                //console.log('2', item, key)
                result.push({ isGroup: true, groupLevel, item: key });
                result.push(...this._mapToArray({ items: item, groupLevel: groupLevel + 1 }))
            }
        })
        return result
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

    _onClose = () => {
        if (!this.props.isActive) {
            this.setState({
                openModal: false
            })
            setTimeout(() => this.setState({
                openModalFlex: false,
                openModalExpand: false
            }), 300)
        }
    }

    _Modal = (openFlex) => <div ref={this._ref} style={{ position: 'relative', color: 'initial' }} >
        {
            !!this.state.elemSize && <Modal
                {...this.props}
                {...this.state}
                items={(!openFlex && this.props.itemsQuickSelection) ? this.props.itemsQuickSelection : this.state.items}
                Height={(openFlex || !this.props.itemsQuickSelection) && this.props.Height}
                headerRenderer={openFlex && this.props.headerRenderer}
                openFlex={openFlex}
                onClose={this._onClose}
            >{(!openFlex && !this.props.isButtonMore) && <div style={{ flex: 'auto', display: 'flex', justifyContent: 'flex-end' }} >{this._btnSpinMore()}</div>}</Modal>}
    </div>

    _btnOnClick = (status) => {


        // this.setState({
        //     openModalFlex: status,
        //     openModalExpand: !status,
        //     openModal: true,
        //     openFlex: status
        // })
        this.setState({
            openModal: !status,
            openModalExpand: !status ? !status : this.state.openModalExpand,
            openModalFlex: status ? status : this.state.openModalFlex
        })
        setTimeout(() => this.setState({
            openModal: true,
            openModalFlex: status,
            openModalExpand: !status
        }), 300)

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