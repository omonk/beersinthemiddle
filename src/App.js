import React, { Component } from 'react';
import config from './config.json';
import InputWrap from './components/input-wrap.js';

class App extends Component {
  constructor() {
    super();

    this.state = {
      locations: [{
        value: 'London',
        key: Math.random() * 100,
      }]
    }
  }

  addLocation() {
    this.state.locations.push({
      name: `Location ${this.state.locations.length + 1}`,
      value: '',
      key: Math.random() * 100,
    });

    this.setState(this.state);
  }

  removeLocation(i) {
    this.state.locations.slice(i, 0);
    this.setState(this.state);
  }

  sendLocations() {
    const locationQueries = this.state.locations.map((location) => {
      return `${location.name}:${location.value}`
    });
    const url = `${config.hostname}/api/location-queries?${locationQueries}`
    fetch(url)
      .catch(err => console.log('there was an error...', err))
      .then(this.updateMap)
  }

  updateMap(locationdata) {
    console.log('updatedMap');
  }

  updateLocationValue(e) {

    console.log(e);
  }

  render() {
    return (
      <div className="ph2 ph7-ns cf sans-serif">
        <div className="fl w-100">
          <h2>{config.site_title}</h2>
        </div>
        {this.state.locations.map((location, p)=>(
          <InputWrap 
            removeLocation={this.removeLocation.bind(this, p)} 
            updateLocationValue={this.updateLocationValue.bind(this)}
            number={p}
            name={location.name} 
            location={location}
            defaultValue={location.value}/>
        ))}
        <button onClick={ this.addLocation.bind(this) }>Add new location</button>
        <button onClick={ this.sendLocations.bind(this)}>Send Locations</button>
      </div>
    );
  }
}

export default App;
