# ch-calendar

#### [Demo]()

# Install
```npm install сh-calendar --save```

# Use
```js
import { Calendar } from 'ch-calendar'
import React, { Component } from 'react';
import 'ch-calendar/dist/ch-calendar.css'

class App extends Component {  
  render() {
    const date = new Date();
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Test Input Field</h1>
        </header>
        <div className='App-intro'>
          <Calendar isModal isButtonActive date={date} onSelect={(date) => { console.log(date) }} /> 
        </div>
      </div>
    );
  }
}
export default App;
```
## Props

Common props you may want to specify include:

* `isButtonActive` - [boolean] If 'true' show 'open' button. If False, the opens is through isActive = 'true'
* `isActive` - [boolean] If 'true' show window
* `dateFrom` - [Date] Start date for mark in the calendar. If undefined, will marked today.
* `dateTo` - [Date] End date for mark in the calendar. If undefined, will marked today.
* `onSelect` - [function] The selected period will be passed in the function in the parameter JSON object: {dateFrom: <dateFrom>, dateTo: <dateTo>}

