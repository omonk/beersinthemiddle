require('dotenv').config();
const express = require('express');

const app = express();

const bodyParser = require('body-parser');
const getFourSquareRecommendations = require('./services/get-four-square-recommendations');

app.use(bodyParser.json());

app.get('/api/foursquare', getFourSquareRecommendations);

app.listen(9000, () => {
  console.log('BITM Server running on http://localhost:9000');
});
