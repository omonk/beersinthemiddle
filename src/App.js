import React, { Component } from 'react';
import config from './config.json';
import InputWrap from './components/input-wrap.js';

class App extends Component {
  constructor() {
    super();

    this.state = {
      locations: [{
        name: 'Location 1',
        value: 'London',
        key: Math.random() * 100,
      }]
    }
  }

  addLocation = () => {
    this.state.locations.push({
      name: `Location ${this.state.locations.length + 1}`,
      value: '',
      key: Math.random() * 100,
    });

    this.setState(this.state);
  }

  removeLocation = (i) => {
    this.state.locations.slice(i, 0);
    this.setState(this.state);
  }

  sendLocations = () => {
    const locationQueries = this.state.locations.map((location) => {
      return `${location.name}:${location.value}`
    });

    console.log(locationQueries);
    
    const url = `${config.hostname}/api/location-request?${locationQueries}`
    fetch(url, {
      mode: 'no-cors'
    })
      .catch(err => console.log('there was an error...', err))
      .then(this.updateMap)
  }

  updateMap = (locationdata) => {
    console.log('updatedMap');
  }

  updateLocationValue = (key, event) => {
    this.state.locations.filter(location => location.key === key).value = event.target.value;
    this.setState(this.state);
  }

  render() {
    return (
      <div className="ph2 ph7-ns cf sans-serif">
        <div className="fl w-100">
          <h2>{config.site_title}</h2>
        </div>
        <form action={this.sendLocations.bind(this)}>
          {this.state.locations.map((location, i)=>(
            <InputWrap 
              removeLocation={this.removeLocation(i)} 
              updateLocationValue={this.updateLocationValue(location.key)}
              key={location.key}
              name={location.name} 
              index={i}
              defaultValue={location.value}/>
          ))}
        </form>
        <button onClick={ this.addLocation() }>Add new location</button>
        <button onClick={ this.sendLocations()}>Send Locations</button>
      </div>
    );
  }
}

export default App;
