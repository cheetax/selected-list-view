import React, { Component } from 'react';
import { List } from 'react-virtualized';
import { Scrollbars } from 'react-custom-scrollbars';
import { BtnFlat } from './BtnSpin'
import { SvgArrowStart, SvgArrowEnd } from './Svg';
//import 'react-custom-scrollbars/lib/react-custom-scrollbar.css'
//import './scroll.css'

//@keydown
var arrowKeys = []
var isGroup = false;

class ListViewCore extends Component {

    constructor(props) {

        super(props)
        //var setSelectedIndex = (props.setSelectedIndex !== undefined) ? props.setSelectedIndex : -1;
        //props.params = {defaultParams} // Object that will be passed to baron as `params` (see baron API https://github.com/Diokuz/baron)
        // props.clipperCls = "clipper"   // className for clipper/root dom node
        // props.scrollerCls = "scroller" // className for scroller dom node
        // props.trackCls = "track"       // className for track dom node
        // props.barCls = "bar"           // className for bar dom node       
        var items = this._arrayToList(props.items)
        var selectItemJson = props.selectItem && JSON.stringify(props.selectItem)
        var setSelectedIndex = items ? items.findIndex(item => JSON.stringify(item) === selectItemJson) : -1;

        this.columnWidth = [];
        this._onKeysDown = this._onKeysDown.bind(this)
        this.keyDown = true;

        this.state = {
            //items_select: props.items.map((item, index) => ({ active: (setSelectedIndex === index) })),
            items: {...items, },
            items_select: items.map((item, index) => ({ active: (setSelectedIndex === index) })),
            setSelectedIndex: setSelectedIndex,
            prevItem: -1,
            height: 0,
            width: 0,
            elem: null,
            readHeader: true,
            columnWidth: [],
            header: null,
            onScroll: true,
            scroll: null,
            btnScrollEnd: false,
            btnScrollStart: false,
            scrollActive: false,
        }
    }

    componentWillReceiveProps(props) {
        var items = this._arrayToList(props.items)
        var selectItemJson = props.selectItem && JSON.stringify(props.selectItem)
        var setSelectedIndex = items ? items.findIndex(item => JSON.stringify(item) === selectItemJson) : -1;
        this.setState({
            items,
            items_select: items.map((item, index) => ({ active: (setSelectedIndex === index) })),
            setSelectedIndex: setSelectedIndex,
        })
    }

    

    _arrayToList = (array = []) => {
        var result = []
        
        array.map(item => {
            if (!Array.isArray(item)) {
                result.push(item)
                //isGroup = false;
            }
            else {
                //isGroup = true;
                result.push(...this._arrayToList(item))
            }
        })
        return result
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
        console.log(this.state.items)
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
        this._setTimerScrollActive()
        document.addEventListener("keydown", this._onKeysDown);
        //document.addEventListener('keyup', this._onKeysUp)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._onKeysDown);
        //document.removeEventListener('keyup', this._onKeysUp)
    }
    
    _onKeysDown = ({ code, type }) => (((code === 'ArrowUp' || code === 'ArrowDown') && this._onKeyArrow({ code })))

    _onKeyArrow = async ({ code }) => {
        let index = this.state.setSelectedIndex
            index = (((code === 'ArrowUp') && (index <= 0 ? 0 : --index)) || ((code === 'ArrowDown') && ((index < this.state.items.length - 1) && ++index)) || index)
            if (index !== this.state.setSelectedIndexm && this.keyDown) {
                this.keyDown = false;
                this.setState({
                    items_select: this.state.items.map((item, i) => ({ active: (i === index) })),
                    setSelectedIndex: index,
                    prevItem: this.state.setSelectedIndex
                })
                this.keyDown = await this._cursorScroll({ index });
                
                
            }
      //  }
    }

    _cursorScroll = ({ index, timer = 20 }) => new Promise(async res => {
        var stepTop = 1;
        let list = this.List;
        const scroll = this.Scroll;
        const scrollTop = list && list.getOffsetForRow({ alignment: '', index });
        if (scroll && scrollTop !== null) {
            var scrolling = scrollTop - scroll.getScrollTop();
            var ticTimer = timer / (Math.abs(scrolling) / stepTop) < 1 ? 1 : timer / (Math.abs(scrolling) / stepTop)
            var step = Math.round(timer / ticTimer);
            var diff = scrolling / step
            for (var i = 1; i <= step; i++) {
                var diffScroll = i * diff;
                await (() => new Promise(resolve => setTimeout(resolve, ticTimer)))()
                scroll.scrollTop(scrollTop - scrolling + diffScroll)
            }
        }
        else await (() => new Promise(resolve => setTimeout(resolve, timer)))()
        res(true)
    })

    _getElem = (elem) => {
        if (elem) {
            var elemHeight = elem.clientHeight;
            var elemWidth = elem.clientWidth;
            this.setState({
                height: elemHeight ? elemHeight : this.state.items.length && this.state.items.length * this._rowHeight(),
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
        console.log(this.state.prevItem, _items_select.length, _items_select)
        if (this.state.prevItem !== -1 && this.state.prevItem < _items_select.length) _items_select[this.state.prevItem].active = false;
        _items_select[_key].active = true;
        let props = this.props;
        (props.onSelectedItem) && props.onSelectedItem(this.state.items[_key]);
        (props.onSelectedIndex) && props.onSelectedIndex(_key);
        //console.log(key, _key, this.state.prevItem)
        this.setState({
            items_select: _items_select,
            prevItem: _key,
            //onScroll: true,
        });

    }


    _rowHeight = () => this.props.rowHeight ? this.props.rowHeight : 48

    _getClassName = (index) => this.state.items_select.length > 0 && (this.state.items_select[index].active ? 'lv-collection-item active' : 'lv-collection-item')

    _rowRendererElem = (param) => {
        var { index } = param;
        var item = this.state.items[index]
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
                    return <div key={index} style={style} >{item}</div>
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

    _onScrollStart = () => this.setState({ scrollActive: true, btnScrollEnd: false, btnScrollStart: false })

    _onScrollStop = () => {
        this.setState({ scrollActive: false })
        this._setTimerScrollActive()
    }

    _allowBtnScroll = (index) => {
        let list = this.List;
        const scroll = this.Scroll;
        const scrollTopList = list && list.getOffsetForRow({ alignment: '', index });
        const scrollTopScroll = scroll && scroll.getScrollTop();
        return (scrollTopList !== scrollTopScroll)
    }

    _setScrollActive = () => {

        !this.state.scrollActive && this.setState({ btnScrollEnd: this._allowBtnScroll(this.state.items.length - 1), btnScrollStart: this._allowBtnScroll(0) })
    }

    _setTimerScrollActive = (timeOut = 500) => setTimeout(() => this._setScrollActive(), timeOut)

    _classActive = (active) => {
        return active && 'active'
    }

    _btnScrollStart = () => <div className={(() => 'btn-scroll btn-scroll-start ' + this._classActive(this.state.btnScrollStart))()}>
        <BtnFlat className='btn-scroll-flat' size={40} onClick={() => this._cursorScroll({ index: 0, timer: 150 })}><SvgArrowStart fill='#fff' /></BtnFlat>
    </div>

    _btnScrollEnd = () => <div className={(() => 'btn-scroll btn-scroll-end ' + this._classActive(this.state.btnScrollEnd))()}>
        <BtnFlat className='btn-scroll-flat' size={40} onClick={() => this._cursorScroll({ index: this.state.items.length - 1, timer: 150 })}><SvgArrowEnd fill='#fff' /></BtnFlat>
    </div>

    render() {
        return (
            <div style={{ width: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                {this._toolsPanelRenderer()}
                {this._headerRenderer()}
                <div
                    style={{ width: '100%', height: '100%', display: 'flex', flex: 'auto', minHeight: 0, position: 'relative' }}
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
                            rowCount={this.state.items.length}
                            rowHeight={this._rowHeight()}
                            rowRenderer={this._rowRenderer}
                            scrollToRow={this.state.setSelectedIndex + 1}
                        />
                    </Scrollbars>
                    {this.props.isBtnScrollStart && this._btnScrollStart()}
                    {this.props.isBtnScrollEnd && this._btnScrollEnd()}
                </div>
            </div>
        )
    }
}

export default ListViewCore;