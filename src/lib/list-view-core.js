import React, { Component } from 'react';
import { List } from 'react-virtualized';

class ListViewCore extends Component {

    constructor(props) {

        super(props)
        var setSelectedIndex = (props.setSelectedIndex !== undefined) ? props.setSelectedIndex : -1;
        this.columnWidth = [];
        this.state = {
            items_select: props.items.map((item, index) => ({ active: (setSelectedIndex === index) })),
            setSelectedIndex: setSelectedIndex,
            prevItem: -1,
            height: 0,
            width: 0,
            elem: null,
            readHeader: true,
            columnWidth: [],
            header: null,
        }
    }

    _getRowHeight = (elemRow) => {
        console.log('1')
    }

    getIndexAsync = async (items1, items2) => await new Promise(async (resolve) => {
        resolve(await (async () => {
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
            return i < 0 ? -1 : i;
        })())
    })

    componentWillReceiveProps(nextProps) {
        let props = this.props
        if (props.items !== nextProps.items) {
            this.getIndexAsync(nextProps.items, props.items).then((index) => {
                if (index === -1) index = this.state.prevItem;
                index = nextProps.items.length === index ? index - 1 : index;
                this.setState({
                    rowHeight: nextProps.rowHeight,
                    items_select: nextProps.items.map((item, i) => ({ active: (i === index) })),
                    setSelectedIndex: index,
                    prevItem: index,
                    readHeader: true,
                })

            })
        }
    }

    resize = () => this._getElem(this.state.elem)

    componentDidMount() {
    //    window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
       // var elem = this.state.elem;
      //  window.removeEventListener('resize', this.resize)
        //elem && elem.removeEventListener('resize', this.resize)
    }

    componentWillReceiveProps(e) {
        console.log(e)
       // this.forceUpdate()
    }

    componentDidUpdate() {
        var elem = this.state.elem;

        elem && elem.parentElement.clientWidth !== this.state.width  && this.setState({width: elem.parentElement.clientWidth})
    }

    _getElem = (elem) => {
        if (elem) {
            elem.parentElement && elem.parentElement.addEventListener('resize', this.resize)
            var elemHeight = elem.parentElement.clientHeight;
            var elemWidth = elem.parentElement.clientWidth;
            this.setState({
                height: elemHeight,
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
        this.setState({
            items_select: _items_select,
            prevItem: _key
        });
        let props = this.props;
        (props.onSelected) && props.onSelected(this.props.items[_key]);
        (props.onSelectedIndex) && props.onSelectedIndex(_key);
        (props.onClose) && props.onClose()
    }

    _rowHeight = ({ index }) => this.props.rowHeight ? this.props.rowHeight : 48;

    _className = (index) => this.state.items_select[index].active ? 'lv-collection-item active' : 'lv-collection-item'

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
        style = {
            ...style,
            cursor: 'pointer',
        }
        return (
            <a
                className={this._className(index)}
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
        var headerColumns = this.props.headerRenderer(param)
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
          //  paddingLeft: '20px',
          //  fontWeight: 'bold',
          //  borderBottom: '1px solid #e0e0e0'
        }} >{this._setHeader()}</div >

    render() {
        return (
            <div style={{ width: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {this._toolsPanelRenderer()}
                {this._headerRenderer()}
                <div
                    style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                    ref={this._getElem}>
                    <List
                        className={this.props.className}
                        width={this.state.width}
                        height={this.state.height}
                        style={{ width: '100%', height: '100%', margin: 0, }}
                        rowCount={this.props.items.length}
                        rowHeight={this._rowHeight}
                        rowRenderer={this._rowRenderer}
                        scrollToIndex={this.state.setSelectedIndex}
                    />
                </div>
            </div>
        )
    }
}

export default ListViewCore;