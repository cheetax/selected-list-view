
import { SelectedListView } from './lib/index'
import React, { Component } from 'react';
import { NumberField } from 'material-inputfield';
import { getDataLocal } from './data'
import 'material-inputfield/dist/material-inputfield.css';
import './App.css';



const getUsers = ({ users, user }) => {
  var _users = []
  for (var i = 1; i <= 100; i++) {
    _users.push({
      ...user,
      firstName: user.firstName + i
    })
  }
  return [...users, ..._users]
}

var users = getUsers({
  users: [],
  user: {
    firstName: 'John',
    surName: 'Ivanov',
    email: 'john@mail.com'
  }
})

var data = getDataLocal();
new Map(data.usersMap)
console.log(data)

class App extends Component {
  constructor(props) {
    super(props)
    //users = 
    this.state = {
      selectUser: null,
    }
  }

  rowRenderer = ({ item }) => {
    return <div>
      <div>{item.cn} {item.title}</div>
      <div>{item.mail}</div>
    </div>


    // return [
    //   <div>{item.cn} {item.title}</div>,
    //   <div>{item.mail}</div>
    // ]

  }

  _valueSelectedUser = () => this.state.selectUser ? this.state.selectUser.firstName + ' ' + this.state.selectUser.surName : ''

  headerRenderer = (param) => [<span width={100} style={param} >Пользователи</span>,
  <span />]

  _selectedListView = () => <SelectedListView
    isField
    isModal
    isButtonExpand
    isButtonMore
    //isActive
    //rowHeight={48}
    isBtnScrollStart
    isBtnScrollEnd
    Width={300}
    Height={300}
    //headerRenderer={this.headerRenderer}
    className='collection'
    items={data.usersMap}
    itemsQuickSelection={[users[0], users[2]]}
    rowRenderer={this.rowRenderer}
    //setSelectedIndex={this.state.selectedIndex}
    selectItem={this.state.selectUser}
    // onSelectedIndex={(index) => {
    //   this.setState({
    //     selectItem: users[index]
    //   })
    // }}
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


        {/* <header className="App-header">
          <h1 className="App-title">Test Input Field</h1>
        </header>
        <h3>Filled text fields</h3> */}

        <div className='App-intro' >
          <NumberField
            outlined
            readOnly
            //onSpinButtons
            //            onChange={(event) => console.log(event)}
            name='label' value={this._valueSelectedUser()}
            type='text'
            label='Label'
            extSpinButton={this._selectedListView} />
        </div>
      </div>
    );
  }
}

export default App;
