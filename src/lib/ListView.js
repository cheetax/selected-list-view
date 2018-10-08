import React, { Component } from 'react';
//import StyleSheet  from 'react-style'
import { List } from 'react-virtualized'



class SelectedListView extends Component {

    constructor(props) {

        super(props)
        var setSelectedIndex = -1;
        if (props.setSelectedIndex) setSelectedIndex = props.setSelectedIndex
        this.state = {
            rowHeight: props.rowHeight,
            items_select: props.items.map((item, index) => ({ active: (setSelectedIndex === index) })),
            items: props.items,
            setSelectedIndex: setSelectedIndex,
            prevItem: -1,
            height: 0,
            width: 0,
            elem: null,
            readHeader: true,
            columnWidth: [],
            header: null,
        }
        this.toolsPanelRenderer = props.toolsPanelRenderer || null;
        this.headerRenderer = props.headerRenderer;
        this._headerRenderer = this._headerRenderer.bind(this);
        this.rowRenderer = props.rowRenderer;
        this.onSelected = props.onSelected;
        this.onSelectedIndex = props.onSelectedIndex;
        this._rowRenderer = this._rowRenderer.bind(this)
        this.resize = this.resize.bind(this);
        this._setHeader();
        //this._rowHeight = this._rowHeight.bind(this)
        // this._onClick = this._onClick.bind(this);
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

    componentWillUpdate(props, prevProps) {
        if (props.items !== prevProps.items) {
            this.getIndexAsync(props.items, prevProps.items).then((index) => {
                if (index === -1) index = this.state.prevItem;
                index = props.items.length === index ? index - 1 : index;
                this.rowRenderer = props.rowRenderer;
                this.setState({
                    rowHeight: props.rowHeight,
                    items: props.items,
                    items_select: props.items.map((item, i) => ({ active: (i === index) })),
                    setSelectedIndex: index,
                    prevItem: index,
                    readHeader: true,
                })

            })
        }
    }

    resize = () => this._getElem(this.state.elem)

    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    _getElem = (elem) => {
        if (elem) {
            var elemHeight = elem.clientHeight;
            var elemWidth = elem.clientWidth;
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
            // this.setState({
            //     columnWidth: columnWidth,
            //     columnHeigth: columnHeigth
            // })
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

        (this.onSelected) ? this.onSelected(this.state.items[_key]) : null;
        (this.onSelectedIndex) ? this.onSelectedIndex(_key) : null;
    }

    _rowHeight = ({ index }) => this.state.rowHeight ? this.state.rowHeight : 32;

    _className = (index) => this.state.items_select[index].active ? 'collection-item active' : 'collection-item'

    _rowRendererElem = (param) => {
        var rowColumns = this.rowRenderer(param)
        if (!Array.isArray(rowColumns)) rowColumns = [rowColumns];
        var columnWidth = this.state.columnWidth;
        return (
            <div style={{ display: 'flex', }} >
                {rowColumns.map((item, index) => {
                    var style = {
                        width: columnWidth[index],
                        // display: 'flex',
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        flex: columnWidth[index] !== 'auto' ? 'none' : 'auto',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        margin: '0 10px'
                    }
                    return <span key={index} style={style} >{item}</span>
                })}
            </div>
        )
    }

    _rowRenderer = (param) => {
        //var _style = {...style , height: 'auto'};
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
        var columnWidth = [];
        var headerColumns = this.headerRenderer(param)
        if (!Array.isArray(headerColumns)) headerColumns = [headerColumns]

        var e = headerColumns.map((item, index) => {
            columnWidth[index] = item.props.width || 'auto';
            var style = {
                width: columnWidth[index],
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                margin: '10px 10px',
                flex: item.props.width ? 'none' : 'auto'
            }
            return (<span key={index} style={style} >{item} </span>)
        })
        this.state = ({
            ...this.state,
            columnWidth: columnWidth,
            header: e
        })
    }

    _toolsPanelRenderer = () => {
        if (this.toolsPanelRenderer) {
            var style = {
                display: 'flex',
                fontWeight: 'bold',
                borderBottom: '1px solid #e0e0e0',
                padding: '10px 20px'
            };
            return <div style={style} >{this.toolsPanelRenderer()}</div >
        }
        else return null;
    }
    _headerRenderer = () => < div style={{ display: 'flex', paddingLeft: '20px', fontWeight: 'bold', borderBottom: '1px solid #e0e0e0' }} >{this.state.header}</div >

    render() {
        return (
            <div style={{ width: 'auto', height: '100%', margin: 0, border: '1px solid #e0e0e0', borderRadius: '2px' }}>
                {this._toolsPanelRenderer()}
                {this._headerRenderer()}
                <div
                    style={{ width: 'auto', height: '100%', margin: 0, }}
                    ref={this._getElem}>
                    <List
                        className={this.props.className}
                        width={this.state.width}
                        height={this.state.height}
                        style={{ width: 'auto', height: '100%', margin: 0, }}
                        rowCount={this.state.items.length}
                        rowHeight={this._rowHeight}
                        rowRenderer={this._rowRenderer}
                        scrollToIndex={this.state.setSelectedIndex}
                    />
                </div>
            </div>



        )
    }
}

export default SelectedListView;