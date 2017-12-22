import React, { Component } from 'react';
import { generate } from 'shortid';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import config from './config.json';

function decimelToRadian(degrees) {
  return degrees * Math.PI / 180;
};

function radianToDecimel(radians) {
  return radians * 180 / Math.PI;
}

function getAverage(arr, key) {
  return arr.reduce((acc, current) => acc + current[key], 0) / arr.length;
};

class App extends Component {
  constructor() {
    super()

    this.state = {
      locations: [],
      inputValue: '',
      mapPointCenter: null
    }

    this.onChange = (address) => this.setState({inputValue: address})
  }

  addLocation = () => {
    this.state.locations.push({
      name: `Location ${this.state.locations.length + 1}`,
      value: '',
      id: Math.random() * 100,
      key: generate(),
    });
    return this.setState(this.state);
  }

  removeLocation = (i) => {
    this.state.locations.slice(i, 0);
    this.setState(this.state);
  }

  sendLocations = () => {
    const locationQueries = this.state.locations.map((location) => {
      return `${location.name}:${location.value}`
    });
    
    const url = `${config.hostname}/api/location-request?${locationQueries}`
    fetch(url, {
      mode: 'no-cors'
    })
      .catch(err => console.log('there was an error...', err))
      // .then(this.updateMap)
  }

  getLocationAddress = location =>
    geocodeByAddress(location)
      .then(res => getLatLng(res[0]))
      .then(res => res);

  // http://geomidpoint.com/calculation.html
  getAverageLongLat = locations => {
    const locationsLength = locations.length;

    const latLongRadians = locations.map(location => ({
      lat: decimelToRadian(location.lat),
      lng: decimelToRadian(location.lng),
    }));

    const latLongCatesian = latLongRadians.map(radian => ({
      x: Math.cos(radian.lat) * Math.cos(radian.lng),
      y: Math.cos(radian.lat) * Math.sin(radian.lng),
      z: Math.sin(radian.lat)
    }));

    const radianAv = {
      x: getAverage(latLongCatesian, 'x'),
      y: getAverage(latLongCatesian, 'y'),
      z: getAverage(latLongCatesian, 'z'),
    }
    
    const long = Math.atan2(radianAv.y, radianAv.x);
    const hyp = Math.sqrt((radianAv.x * radianAv.x) + (radianAv.y * radianAv.y));
    const lat = Math.atan2(radianAv.z, hyp);

    const midPointsToDecimels = {
      lat: radianToDecimel(lat),
      long: radianToDecimel(long)
    }

    return midPointsToDecimels;
  }

  submitFrom = (event) => {
    event.preventDefault();

    Promise.all(
      this.state.locations.map(location => this.getLocationAddress(location))
    ).then(res => {
      const averageLongLat = this.getAverageLongLat(res);
      this.setState({mapPointCenter: averageLongLat});
    });
  }

  handleSelect = (address) => {
    if (!this.state.locations.includes(address)) {
      return this.setState({
        locations: [...this.state.locations, address],
        inputValue: '',
      });
    }
  }

  render() {
    const PlacesInputProps = {
      value: this.state.inputValue,
      onChange: this.onChange,
    };

    return (
      <div className="ph2 ph7-ns cf sans-serif">
        <div className="fl w-100">
          <h2>{config.site_title}</h2>
        </div>
        <form onSubmit={this.submitFrom.bind(this)}>
          <PlacesAutocomplete inputProps={PlacesInputProps} onSelect={this.handleSelect}/>
          <ul>
          {this.state.locations.length > 0 && this.state.locations.map(location => (
            <li key={generate()}>{location}</li>
          ))}
          </ul>
          <button type="submit">Send Locations</button>
        </form>
      </div>
    );
  }
}

export default App;
