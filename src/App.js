
import SelectedListView from './lib/index'
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateFrom: new Date(),
      dateTo: new Date()
    }
  }

  rowRenderer = ({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }) => {
    if (this.props.users.length - 1 < index) return null;
    return [
      <span style={{ paddingRight: 10, }} >{this.props.users[index].firstName} {this.props.users[index].surName}</span>,
      <span style={{ paddingRight: 10 }} >{this.props.users[index].email}</span>
    ]
  }

  headerRenderer = (param) => [<span width={150} style={param.style}   >Имя, Фамилия</span>,
  <span style={param.style}  >Email</span>]

  render() {
    //    console.log(this.state)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Test Input Field</h1>
        </header>
        <h3>Filled text fields</h3>
        <div className='App-intro' >
          <SelectedListView isField isButtonActive dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} onSelect={(period) => this.setState({ ...period })} />
        </div>
      </div>
    );
  }
}

export default App;
