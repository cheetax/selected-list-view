import React, { Component } from 'react';
import { List } from 'react-virtualized';
import { Scrollbars } from 'react-custom-scrollbars';
import { BtnSpin } from './BtnSpin'
import { SvgExpandMore } from './Svg';
//import 'react-custom-scrollbars/lib/react-custom-scrollbar.css'
//import './scroll.css'

//@keydown
class ListViewCore extends Component {

    constructor(props) {

        super(props)
        //var setSelectedIndex = (props.setSelectedIndex !== undefined) ? props.setSelectedIndex : -1;
        //props.params = {defaultParams} // Object that will be passed to baron as `params` (see baron API https://github.com/Diokuz/baron)
        // props.clipperCls = "clipper"   // className for clipper/root dom node
        // props.scrollerCls = "scroller" // className for scroller dom node
        // props.trackCls = "track"       // className for track dom node
        // props.barCls = "bar"           // className for bar dom node       

        var selectItemJson = props.selectItem && JSON.stringify(props.selectItem)
        var setSelectedIndex = props.items ? props.items.findIndex(item => JSON.stringify(item) === selectItemJson) : -1;

        this.columnWidth = [];
        this.state = {
            //items_select: props.items.map((item, index) => ({ active: (setSelectedIndex === index) })),
            items_select: props.items.map((item, index) => ({ active: (setSelectedIndex === index) })),
            setSelectedIndex: setSelectedIndex,
            prevItem: -1,
            height: 0,
            width: 0,
            elem: null,
            readHeader: true,
            columnWidth: [],
            header: null,
            onScroll: true,
            scroll: null
        }
    }

    handleScroll = ({ target }) => {
        const { scrollTop, scrollLeft, clientHeight } = target;
        const list = this.List;
        //console.log(scrollTop)
        list && list.scrollToPosition(scrollTop)
    }

    refScroll = (elem) => {
        this.Scroll = elem
    }

    List = null;
    Scroll = null;

    getIndexAsync = (items1, items2) => new Promise((resolve) => {
        var i = -1;
        var _itemsSearch = [...items1];
        var _itemsElements = [...items2];
        if (items1.length !== items2.length && items2.length !== 0) {
            if (items1.length > items2.length) {
                _itemsSearch = [...items2];
                _itemsElements = [...items1];
            }
            var i_end = _itemsElements.length;
            for (i = (i_end / 2 | 0); i_end - i > 1 && i > 1;) {

                if (JSON.stringify(_itemsElements[i]) === JSON.stringify(_itemsSearch[i])) {
                    i = i + ((i_end - i) / 2 | 0);
                }
                else {
                    i_end = i;
                    i = (i / 2 | 0);
                }
            }
        }

        _itemsSearch = _itemsSearch.splice(i - 1, i_end + 1).map(item => JSON.stringify(item));
        _itemsElements = _itemsElements.splice(i - 1, i_end + 1);

        i = i - 1 + _itemsElements.findIndex(item => !_itemsSearch.includes(JSON.stringify(item)));
        resolve(i < 0 ? -1 : i)
    })    

    resize = () => this._getElem(this.state.elem)

    componentDidUpdate() {
        var elem = this.state.elem;
        let index = this.state.setSelectedIndex;
        if (index !== -1 && this.state.onScroll) {
            let list = this.List;
            const scroll = this.Scroll;
            const clientHeight = scroll && scroll.getClientHeight();
            let scrollTop = list && list.getOffsetForRow({ alignment: '', index });
            const rowHeight = this._rowHeight();
            scrollTop = scrollTop > (clientHeight - rowHeight) / 2 ? scrollTop + (clientHeight - rowHeight) / 2 : scrollTop > 0 ? clientHeight / 2 : 1;
            (scroll && scrollTop !== null) && scroll.scrollTop(scrollTop)
            this.setState({ onScroll: false })
        }
        elem && elem.parentElement.clientWidth !== this.state.width && this.setState({ width: elem.parentElement.clientWidth })
    }

    componentWillMount() {
        document.addEventListener("keydown", this._onKeysDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._onKeysDown);
    }

    _onKeysDown = ({ code }) => ((code === 'ArrowUp' || code === 'ArrowDown') && this._onKeyArrow({ code }))

    _onKeyArrow = ({ code }) => {
        let index = this.state.setSelectedIndex
        index = (((code === 'ArrowUp') && (index <= 0 ? 0 : --index)) || ((code === 'ArrowDown') && ((index < this.props.items.length-1) && ++index)) || index)         
        index !== this.state.setSelectedIndex && (() => {
            this._cursorScroll(index);
            this.setState({
            items_select: this.props.items.map((item, i) => ({ active: (i === index) })),
            setSelectedIndex: index,
            prevItem: this.state.setSelectedIndex
        })})()
    }

    _cursorScroll = async (index) => {
        let list = this.List;
        const scroll = this.Scroll;
        const scrollTop = list && list.getOffsetForRow({ alignment: '', index });
        if (scroll && scrollTop !== null) {
            var scrolling = scrollTop - scroll.getScrollTop();
            var diff = scrolling / 5;
            for (var i = 1; i <= 5; i++) {
                var diffScroll = i * diff;
                await(() => new Promise(resolve => setTimeout(resolve, 30)))()   
                scroll.scrollTop(scrollTop - scrolling + diffScroll)
            }
        }        
    }

    _getElem = (elem) => {
        if (elem) {
            var elemHeight = elem.clientHeight;
            var elemWidth = elem.clientWidth;
            this.setState({
                height: elemHeight ? elemHeight : this.props.items.length && this.props.items.length * this._rowHeight(),
                width: elemWidth,
                elem: elem
            })
        }
    }

    _getElemRowColumns = (elem, index) => {
        if (elem) {
            var columnHeigth = this.state.columnHeigth;
            var columnWidth = this.state.columnWidth;
            columnWidth[index] = elem.clientWidth
            columnHeigth[index] = elem.clientHeight
        }
    }

    _onClick = (key) => {
        this._onSelected(key);
        let props = this.props;
        (props.onClose) && props.onClose()
    }

    _onSelected = (key) => {
        var _key = parseInt(key, 10)
        var _items_select = [...this.state.items_select];
        if (this.state.prevItem !== -1 && this.state.prevItem < _items_select.length) _items_select[this.state.prevItem].active = false;
        _items_select[_key].active = true;
        let props = this.props;
        (props.onSelectedItem) && props.onSelectedItem(this.props.items[_key]);
        (props.onSelectedIndex) && props.onSelectedIndex(_key);
        //console.log(key, _key, this.state.prevItem)
        this.setState({
            items_select: _items_select,
            prevItem: _key,
            //onScroll: true,
        });

    }


    _rowHeight = () => this.props.rowHeight ? this.props.rowHeight : 48

    _getClassName = (index) => this.state.items_select[index].active ? 'lv-collection-item active' : 'lv-collection-item'

    _rowRendererElem = (param) => {
        var { index } = param;
        var item = this.props.items[index]
        var rowColumns = this.props.rowRenderer({ item })
        if (!Array.isArray(rowColumns)) rowColumns = [rowColumns];
        var columnWidth = this.columnWidth;
        return (
            <div style={{ display: 'flex', }} >
                {rowColumns.map((item, index) => {
                    var style = {
                        width: columnWidth[index],
                        flex: columnWidth[index] !== 'auto' ? 'none' : 'auto',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        margin: '0 10px 0 0'
                    }
                    return <span key={index} style={style} >{item}</span>
                })}
            </div>
        )
    }

    _rowRenderer = (param) => {
        var { key, style, index } = param;
        //        console.log(key, index)
        style = {
            ...style,
            cursor: 'pointer',
        }
        return (
            <a
                className={this._getClassName(index)}
                key={key}
                style={style}
                //onMouseDown={() => this._onSelected(key)}
                onClick={() => this._onClick(key)}
            >
                {this._rowRendererElem(param)}
            </a>
        )
    }

    _setHeader = () => {
        var style = {
            width: 'auto',
            height: 'auto',
        }
        var param = {
            style
        }
        var headerColumns = this.props.headerRenderer ? this.props.headerRenderer(param) : []
        if (!Array.isArray(headerColumns)) headerColumns = [headerColumns]

        return headerColumns.map((item, index) => {
            this.columnWidth[index] = item.props.width || 'auto';
            var style = {
                width: this.columnWidth[index],
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                margin: '12px 16px',
                flex: item.props.width ? 'none' : 'auto'
            }
            return (<span key={index} style={style} >{item} </span>)
        })
    }

    _toolsPanelRenderer = () => (this.props.toolsPanelRenderer) && <div
        style={{
            display: 'flex',
            //fontWeight: 'bold',
            //  borderBottom: '1px solid #e0e0e0',
            padding: '10px 20px'
        }} >{this.toolsPanelRenderer()}</div >

    _headerRenderer = () => < div
        style={{
            display: 'flex',
        }} >{this._setHeader()}</div >

    _onScrollStart = () => {
        console.log('start')
    }

    _onScrollStop = () => {
        console.log('stop')
    }

    render() {
        return (
            <div style={{ width: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                {this._toolsPanelRenderer()}
                {this._headerRenderer()}
                <div
                    style={{ width: '100%', height: '100%', display: 'flex', flex: 'auto', minHeight: 0 }}
                    ref={this._getElem}
                >
                    <Scrollbars
                        autoHide
                        onScrollStart={this._onScrollStart}
                        onScrollStop={this._onScrollStop}
                        style={{ width: this.state.width, height: this.state.height }}
                        onScroll={this.handleScroll}
                        ref={this.refScroll}
                    >
                        <List
                            ref={instance => (this.List = instance)}
                            className={this.props.className}
                            width={this.state.width}
                            height={this.state.height}
                            style={{ width: '100%', height: '100%', margin: 0, minHeight: 0, overflowX: false, overflowY: false }}
                            rowCount={this.props.items.length}
                            rowHeight={this._rowHeight()}
                            rowRenderer={this._rowRenderer}
                            scrollToRow={this.state.setSelectedIndex + 1}
                        />
                    </Scrollbars>
                    <div className='btn-scroll-end'>
                        <BtnSpin className='btn-scroll-flat' size={40} onClick={() => console.log('end')}><SvgExpandMore /></BtnSpin>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListViewCore;