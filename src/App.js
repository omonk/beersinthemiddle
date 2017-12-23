import React, { Component } from 'react';
import { generate } from 'shortid';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import getLongLatMidPoint from './utils/getLongLatMidPoint';
import Map from './components/Map';
import config from './config.json';

// Styles
import './css/Map.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      inputValue: '',
      locations: [],
      locationsMidPoint: {
        lat: 0,
        lng: 0,
        label: 'center',
      },
      locationsMidPointDefined: false,
      mapCenter: {
        lat: 0,
        lng: 0,
      },
    };

    this.onChange = address => this.setState({ inputValue: address });
  }

  componentWillMount() {
    if ('geolocation' in navigator) {
      this.setState({ mapCenterLoading: true });
      navigator.geolocation.getCurrentPosition(
        this.getCurrentPositionSuccess,
        this.getCurrentPositionError,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    } else {
      /* geolocation IS NOT available */
    }
  }

  getCurrentPositionSuccess = (pos) => {
    const crds = pos.coords;
    console.log(crds);
    console.log('mapCenterLoading: false');
    this.setState({
      mapCenter: {
        lat: crds.latitude,
        lng: crds.longitude,
      },
      mapCenterLoading: false,
    });
  }

  getCurrentPositionError = (err) => {
    this.setState({
      geoLocationError: true,
      mapCenterLoading: false,
    });
  }

  // removeLocation = (i) => {
  //   this.state.locations.slice(i, 0);
  //   this.setState(this.state);
  // }

  getLocationAddress = location =>
    geocodeByAddress(location)
      .then(res => getLatLng(res[0]))
      .then(res => res);

  submitFrom = (event) => {
    event.preventDefault();

    Promise.all(
      this.state.locations.map(location => this.getLocationAddress(location)),
    ).then((res) => {
      const averageLongLat = getLongLatMidPoint(res);
      this.setState({
        locationsMidPoint: {
          ...averageLongLat,
          label: 'you',
        },
      });
    });
  }

  sendLocations = () => {
    const locationQueries = this.state.locations.map(location => `${location.name}:${location.value}`);

    const url = `${config.hostname}/api/location-request?${locationQueries}`;
    fetch(url, {
      mode: 'no-cors',
    })
      .catch(err => console.log('there was an error...', err));
    // .then(this.updateMap)
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
          <PlacesAutocomplete inputProps={PlacesInputProps} onSelect={this.handleSelect} />
          <ul>
            {this.state.locations.length > 0 && this.state.locations.map(location => (
              <li key={generate()}>{location}</li>
          ))}
          </ul>
          <button type="submit">Send Locations</button>
        </form>
        <div className="map__wrapper--outer">
          {this.state.mapCenterLoading && (
            <div className="map__loading">
              <p>Map center loading...</p>
            </div>
          )}
          <div className="map__wrapper--inner">
            <Map
              zoom={10}
              center={this.state.mapCenter}
              locations={this.state.locations}
              locationsMidPoint={this.state.locationsMidPoint}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
