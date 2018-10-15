
import { SelectedListView } from './lib/index'
import React, { Component } from 'react';
import { NumberField } from 'material-inputfield';
import 'material-inputfield/dist/material-inputfield.css';

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
  
]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  rowRenderer = ({ item }) => {
    return [
      <span>{item.firstName} {item.surName}</span>,
      <span>{item.email}</span>
    ]
  }

  _valueSelectedUser = () => this.state.selectedUser && this.state.selectedUser.firstName + ' ' + this.state.selectedUser.surName
 
  headerRenderer = (param) => [<span width={100} style={param.style}   >Пользователи</span>,
  <span />]

  _selectedListView = () => <SelectedListView
    isField
    isModal
    isButtonActive
    Width={300}
    Height={500}
    //  headerRenderer={this.headerRenderer}
    className='collection'
    items={users}
    rowRenderer={this.rowRenderer}
    setSelectedIndex={this.state.selectedIndex}
    onSelectedIndex={(index) => {
      this.setState({
        selectedUser: users[index],
        edit: false,
        selectedIndex: index,
        newUser: {},
      })
    }}
  />

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
            onChange={(event) => console.log(event)}
            name='label' value={this._valueSelectedUser()}
            type='text'
            label='Label'
            extSpinButton={this._selectedListView} />
          <SelectedListView
            isButtonActive
            Width={300}
            Height={500}
            headerRenderer={this.headerRenderer}
            className='collection'
            items={users}
            rowRenderer={this.rowRenderer}
            setSelectedIndex={this.state.selectedIndex}
            onSelectedIndex={(index) => {
              this.setState({
                selectedUser: users[index],
                edit: false,
                selectedIndex: index,
                newUser: {},
              })
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
