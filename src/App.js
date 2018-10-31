
import { SelectedListView } from './lib/index'
import React, { Component } from 'react';
import { NumberField } from 'material-inputfield';
import { List } from 'react-virtualized';
import CustomScroll from 'react-custom-scroll';
import 'material-inputfield/dist/material-inputfield.css';
import './lib/selected-list-view-core.css'

import './App.css';

var users = [
  {
    firstName: 'Ivan',
    surName: 'Petrov',
    email: 'ivan@mail.com'
  },
  {
    firstName: 'Petro',
    surName: 'Ivanov',
    email: 'petro@mail.com'
  },
  {
    firstName: 'John',
    surName: 'Ivanov',
    email: 'john@mail.com'
  },
  {
    firstName: 'Ilon',
    surName: 'Petrov',
    email: 'ilon@mail.com'
  },
  {
    firstName: 'Ilon',
    surName: 'Petrov',
    email: 'ilon@mail.com'
  },
  {
    firstName: 'Ilon',
    surName: 'Petrov',
    email: 'ilon@mail.com'
  },
  {
    firstName: 'Ilon',
    surName: 'Petrov',
    email: 'ilon@mail.com'
  },
  {
    firstName: 'Ilon',
    surName: 'Petrov',
    email: 'ilon@mail.com'
  },
  {
    firstName: 'Ilon',
    surName: 'Petrov',
    email: 'ilon@mail.com'
  },
]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectUser: null,
    }
  }



  rowRenderer = ({ item }) => {

    return [
      <span>{item.firstName} {item.surName}</span>,
      <span>{item.email}</span>
    ]
  }

  _rowRenderer = (param) => {
    return this.rowRenderer({ item: users[param.index] })
  }

  _valueSelectedUser = () => this.state.selectUser && this.state.selectUser.firstName + ' ' + this.state.selectUser.surName

  headerRenderer = (param) => [<span width={100} style={param} >Пользователи</span>,
  <span />]

  _selectedListView = () => <SelectedListView
    isField
    isModal
    isButtonExpand
    isButtonMore
    Width={300}
    Height={300}
    headerRenderer={this.headerRenderer}
    className='collection'
    items={users}
    itemsQuickSelection={[users[0], users[2]]}
    rowRenderer={this.rowRenderer}
    setSelectedIndex={this.state.selectedIndex}
    selectItem={this.state.selectUser}
    onSelectedIndex={(index) => {
      this.setState({
        selectItem: users[index]
      })
    }}
    onSelectedItem={(item) => {
      this.setState({
        selectUser: item,
      })
    }}
  />

  _headerRenderer = () => <div
    style={
      {
        display: 'flex',
        flex: 'auto'
      }
    }><span
      style={
        {
          width: 'auto',
          height: 'auto',
        }
      }>{this.headerRenderer({ width: 'auto', height: 'auto' })} </span>
  </div >

  render() {
    return (
      <div className="App">

        <div style={{ width: 200, height: 300, }} >
          <div style={{ width: '100%', height: '100%', background: 'green' }} >
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', flex: 'auto' }} >
              <div style={{ padding: 8, background: 'red' }}>
                Пользователи
              </div>
              <div style={{ height: '100%', width: '100%', flex: 'auto', display: 'flex'}}>
                {/* <CustomScroll allowOuterScroll="{true}" flex="1">
                  <div style={{ height: 600, width: '100%', flex: 'auto', background: 'blue' }}>

                  </div>
                </CustomScroll> */}
              </div>

            </div>

          </div>
        </div>
        {/* <header className="App-header">
          <h1 className="App-title">Test Input Field</h1>
        </header>
        <h3>Filled text fields</h3> */}

        <div className='App-intro' >
          {/* <NumberField
            outlined
            readOnly
            //onSpinButtons
            onChange={(event) => console.log(event)}
            name='label' value={this._valueSelectedUser()}
            type='text'
            label='Label'
            extSpinButton={this._selectedListView} /> */}

          {/* </div> */}
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', flex: 'auto', border: '1px solid grey' }}>
            {this._headerRenderer()}
            <div
              style={{ width: '100%', height: '100%', display: 'flex', flex: 'auto' }}
              ref={this._getElem}>
              <CustomScroll allowOuterScroll="{true}" flex='1'>
                <div>
                  <div style={{ background: 'red', height: 342, width: '100%' }} />
                  {/* <List
                            className={this.props.className}
                            width={500}
                            height={250}
                            style={{ width: '100%', height: '100%',  margin: 0, flex: 'auto' }}
                            rowCount={users.length}
                            rowHeight={48}
                            rowRenderer={this._rowRenderer}
                           // scrollToIndex={this.state.setSelectedIndex}
                        /> */}
                </div>

              </CustomScroll>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
