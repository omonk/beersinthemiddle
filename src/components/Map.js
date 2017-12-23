import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import { generate } from 'shortid';

const LocationMarker = ({ text }) => <div>{text}</div>;
const MidPointMarker = ({ text }) => <div>{text}</div>;

class Map extends Component {
  constructor() {
    super();
  }

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
      >
        {locationsMidPoint && (
        <MidPointMarker
          lat={locationsMidPoint.lat}
          lng={locationsMidPoint.lng}
          text={locationsMidPoint.label}
        />
        )}

        {locations.length > 0 && locations.map(location => (
          <LocationMarker
            key={generate()}
            lat={location.lat}
            lng={location.lng}
            text={location.label}
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
