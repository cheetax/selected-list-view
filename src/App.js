
import { SelectedListView } from './lib/index'
import React, { Component } from 'react';
import { NumberField } from 'material-inputfield';
import 'material-inputfield/dist/material-inputfield.css';

import './App.css';

var users = [
  {
    firstName: 'user',
    surName: 'user',
    email: 'user@mail.com'
  },
  {
    firstName: 'user1',
    surName: 'user1',
    email: 'user1@mail.com'
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
        <header className="App-header">
          <h1 className="App-title">Test Input Field</h1>
        </header>
        <h3>Filled text fields</h3>

        <div className='App-intro' >
          <NumberField
            outlined
            //onSpinButtons
            onChange={(event) => console.log(event)}
            name='label' value={123456789}
            type='number'
            label='Label'
            extSpinButton={this._selectedListView} />
          <SelectedListView
            //isField
            isModal
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
