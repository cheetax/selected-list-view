import React, { Component } from 'react';
import { List } from 'react-virtualized';
import { Scrollbars } from 'react-custom-scrollbars'
//import 'react-custom-scrollbars/lib/react-custom-scrollbar.css'
//import './scroll.css'

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
        const { scrollTop, scrollLeft } = target;
        const { Grid: grid } = this.List;
        grid.handleScrollEvent({ scrollTop, scrollLeft });
    }

    listScroll = (target) => {
        //console.log(target)
        if (this.state.onScroll) {
            const { scrollTop } = target;
            const scroll = this.state.scroll;
            (scroll) && scroll.scrollTop(scrollTop)
            this.setState({ onScroll: false })
        }
    }

    refScroll = (elem) => {
        elem && this.setState({ scroll: elem })
    }

    List = null;

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

    componentWillReceiveProps(nextProps) {
        let props = this.props
        if (JSON.stringify(props.items) !== JSON.stringify(nextProps.items)) {
            this.getIndexAsync(nextProps.items, props.items).then((index) => {
                var _index = -1;
                if (index === -1) _index = this.state.prevItem;
                _index = nextProps.items.length === index ? index - 1 : index;
                this.setState({
                    rowHeight: nextProps.rowHeight,
                    items_select: nextProps.items.map((item, i) => ({ active: (i === _index) })),
                    setSelectedIndex: _index,
                    prevItem: _index,
                    readHeader: true,
                })

            })
        }
        else {
            // const scroll = this.state.scroll;
            // const { scrollTop } = scroll ? scroll.getValues() : {scrollTop: null};
            // (scrollTop !== null ) && scroll.scrollTop(scrollTop + ((scrollTop === 0) ? 1 : -1))
            // console.log(scrollTop)
            let selectItemJson = JSON.stringify(props.selectItem)
            let index = props.items.findIndex(item => JSON.stringify(item) === selectItemJson);
            if (index !== -1) {
                let list = this.List;
                const scroll = this.state.scroll;
                const scrollTop = list && list.getOffsetForRow({ alignment: '', index });
                (scrollTop !== null && scroll) && scroll.scrollTop(scrollTop + 1)
                //console.log(index, scrollTop)
            }
            this.setState({
                items_select: nextProps.items.map((item, i) => ({ active: (i === index) })),
                setSelectedIndex: index,
            })
        }
    }

    resize = () => this._getElem(this.state.elem)

    componentDidUpdate() {
        var elem = this.state.elem;

        elem && elem.parentElement.clientWidth !== this.state.width && this.setState({ width: elem.parentElement.clientWidth })
    }

    _getElem = (elem) => {
        if (elem) {
            var elemHeight = elem.clientHeight;
            var elemWidth = elem.clientWidth;
            this.setState({
                height: elemHeight ? elemHeight : this.props.items.length && this.props.items.length * this._rowHeight({}),
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
        var _key = parseInt(key, 10)
        var _items_select = this.state.items_select;
        if (this.state.prevItem !== -1 && this.state.prevItem < _items_select.length) _items_select[this.state.prevItem].active = false;
        _items_select[_key].active = true;
        
        let props = this.props;
        (props.onSelectedItem) && props.onSelectedItem(this.props.items[_key]);
        (props.onSelectedIndex) && props.onSelectedIndex(_key);
        (props.onClose) && props.onClose()
        this.setState({
            items_select: _items_select,
            prevItem: _key,
            onScroll: true,
        });
    }

    _rowHeight = ({ index }) => this.props.rowHeight ? this.props.rowHeight : 48;

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
        var headerColumns = this.props.headerRenderer && this.props.headerRenderer(param) || []
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

    render() {
        return (
            <div style={{ width: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {this._toolsPanelRenderer()}
                {this._headerRenderer()}
                <div
                    style={{ width: '100%', height: '100%', display: 'flex', flex: 'auto', minHeight: 0 }}
                    ref={this._getElem}>
                    <Scrollbars
                        autoHide
                        style={{ width: this.state.width, height: this.state.height }}
                        onScroll={this.handleScroll}
                        ref={this.refScroll}
                    >
                        <List
                            ref={instance => (this.List = instance)}
                            onScroll={this.listScroll}
                            className={this.props.className}
                            width={this.state.width}
                            height={this.state.height}
                            style={{ width: '100%', height: '100%', margin: 0, minHeight: 0, overflowX: false, overflowY: false }}
                            rowCount={this.props.items.length}
                            rowHeight={this._rowHeight}
                            rowRenderer={this._rowRenderer}
                            scrollToIndex={this.state.setSelectedIndex}
                        />
                    </Scrollbars>

                </div>
            </div>
        )
    }
}

export default ListViewCore;