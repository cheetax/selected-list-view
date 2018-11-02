
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
    firstName: 'Ilon21',
    surName: 'Petrov21',
    email: 'ilon@mail.com'
  },
  {
    firstName: 'Ilon22',
    surName: 'Petrov22',
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
  
  _valueSelectedUser = () => this.state.selectUser ? this.state.selectUser.firstName + ' ' + this.state.selectUser.surName : ''

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
    items={[...users]}
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
            onChange={(event) => console.log(event)}
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
