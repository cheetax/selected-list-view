
import { SelectedListView } from './lib/index'
import React, { Component } from 'react';
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

  headerRenderer = (param) => [<span width={150} style={param.style}   >Имя, Фамилия</span>,
  <span style={param.style}  >Email</span>]

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Test Input Field</h1>
        </header>
        <h3>Filled text fields</h3>
        <div className='App-intro' >
          <SelectedListView
            isModal
            isButtonActive
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
          //setSelectedIndex={this.state.selectedIndex}
          />
        </div>
      </div>
    );
  }
}

export default App;
