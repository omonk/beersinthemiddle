import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import { generate } from 'shortid';

import locationsMetaData from '../utils/locationPreSelect.json';
import LocationMarker from '../assets/locationMarker';
import LocationMidPointMarker from '../assets/locationMarker';

class Map extends Component {
//   constructor() {
//     super();
//   }

  componentWillMount() {
    // if ('geolocation' in navigator) {
    //   /* geolocation is available */
    // } else {
    //   /* geolocation IS NOT available */
    // }
  }

  render() {
    const {
      center,
      zoom,
      locations,
      locationsMidPoint,
    } = this.props;

    return (
      <GoogleMapReact
        center={center}
        defaultZoom={zoom}
        bootstrapURLKeys={{
            key: 'AIzaSyC4yjCTPVzFZx0Fj0P9mSei1btoPQexc0s',
            language: 'en',
          }}
      >
        {locationsMidPoint && (
        <LocationMidPointMarker
          lat={locationsMidPoint.lat}
          lng={locationsMidPoint.lng}
          text={locationsMidPoint.label}
        />
        )}

        {locations.length > 0 && locations.map((location, i) => (
          <LocationMarker
            key={generate()}
            lat={location.lat}
            lng={location.lng}
            text=""
            color={locationsMetaData.locations[i].color}
          />
        ))}
      </GoogleMapReact>
    );
  }
}

Map.defaultProps = {
  center: {
    lat: 59.95,
    lng: 30.33,
  },
  zoom: 11,
};

Map.propTypes = {
  locations: PropTypes.array.isRequired,
  locationsMidPoint: PropTypes.object.isRequired,
};

export default Map;
