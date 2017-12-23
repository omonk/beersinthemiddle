import React, { Component } from 'react';
import { generate } from 'shortid';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import getLongLatMidPoint from './utils/getLongLatMidPoint';
import Map from './components/Map';
import config from './config.json';
import locationsMetaData from './utils/locationPreSelect.json';

// Styles
import './css/Map.css';
import './css/LocationsList.css';

const Form = ({
  submitForm, placesStyles, placesInputProps, handleSelect,
}) => (
  <form onSubmit={submitForm}>
    <PlacesAutocomplete
      inputProps={placesInputProps}
      onSelect={handleSelect}
      styles={placesStyles}
    />
    <button type="submit">Send Locations</button>
  </form>
);

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
      recommendations: [],
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
    }
  }

  getCurrentPositionSuccess = (pos) => {
    const crds = pos.coords;

    this.setState({
      mapCenter: {
        lat: crds.latitude,
        lng: crds.longitude,
      },
      mapCenterLoading: false,
    });
  }

  getCurrentPositionError = (err) => {
    console.log(err);
    this.setState({
      geoLocationError: true,
      mapCenterLoading: false,
    });
  }

  getLocationAddress = location =>
    geocodeByAddress(location)
      .then(res => getLatLng(res[0]))

  submitFrom = (event) => {
    event.preventDefault();
    this.setState({
      apiCallLoading: true,
    });
    const averageLongLat = getLongLatMidPoint(this.state.locations);
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`/api/foursquare?ll=${averageLongLat.lat},${averageLongLat.lng}`, options)
      .then(res => res.json())
      .then((res) => {
        console.log(res);
        this.setState({
          recommendations: res.response,
          locationsMidPoint: {
            ...averageLongLat,
          },
          apiCallLoading: false,
        });
      });
  }

  removeLocation = (i) => {
    this.state.locations.slice(i, 0);
    this.setState(this.state);
  }

  handleSelect = (address) => {
    if (!this.state.locations.includes(address)) {
      geocodeByAddress(address)
        .then(res => getLatLng(res[0]))
        .then((res) => {
          const newLocation = {
            lat: res.lat,
            lng: res.lng,
            address,
          };

          this.setState({
            locations: [
              ...this.state.locations,
              newLocation,
            ],
            mapCenter: {
              lat: newLocation.lat,
              lng: newLocation.lng,
            },
            inputValue: '',
          });
        });
    }
  }

  render() {
    return (
      <div className="ph2 ph7-ns cf sans-serif">
        <div className="fl w-100">
          <h2>{config.site_title}</h2>
        </div>
        <Form
          submitForm={this.submitFrom}
          handleSelect={this.handleSelect}
          placesInputProps={{
            value: this.state.inputValue,
            onChange: this.onChange,
          }}
          placesStyles={{
            root: {
              zIndex: 100,
            },
          }}
        />
        <ul className="location__list">
          {this.state.locations.length > 0 && this.state.locations.map((location, i) => (
            <li
              className="location__list-item"
              style={{ backgroundColor: locationsMetaData.locations[i].color }}
              key={generate()}
            >
              <p>{location.address}</p>
            </li>
            ))}
        </ul>
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
              recommendations={this.state.recommendations}
            />
          </div>
        </div>
        <ul>
          {this.state.recommendations.length > 0 &&
            this.state.recommendations.map(recommendation => (
              <li key={generate()}>
                <p>{recommendation.title}</p>
              </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
