
import SelectPeriod from './lib/select-period'
import React, { Component } from 'react';
import './App.css';
import 'ch-calendar/dist/ch-calendar.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateFrom: new Date(),
      dateTo: new Date()
    }
  }

  render() {
//    console.log(this.state)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Test Input Field</h1>
        </header> 
        <h3>Filled text fields</h3>
        <div className='App-intro' >
          <SelectPeriod isField isButtonActive dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} onSelect={(period) => this.setState({...period})} />          
        </div>        
      </div>
    );
  }
}

export default App;
