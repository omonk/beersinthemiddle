const fetch = require('node-fetch');

const getParamsWithLL = ll => `?ll=${ll}&client_id=${process.env.FOURSQUARE_API_CLIENT}&client_secret=${process.env.FOURSQUARE_API_SECRET}&v=20170509&section=drinks`;

const getFourSquareRecommendations = (ll) => {
  const baseUrl = 'https://api.foursquare.com/v2/venues/explore';
  const url = `${baseUrl}${getParamsWithLL(ll)}`;
  const options = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  console.log(url);
  return fetch(url, options)
    .then(res => res.json())
    .then(res => res);
};

const formatFourSquareResponse = data => data;

module.exports = (req, res) => {
  const { ll } = req.query;

  return getFourSquareRecommendations(ll)
    .then(response => formatFourSquareResponse(response))
    .then(response => res.send({ response }));
};

