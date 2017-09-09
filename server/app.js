const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const locationQueries = require("./services/location-queries.service");
app.use(bodyParser.json());

app.get("/api/location-request", locationQueries);


app.listen(9000, function () {
    console.log("BITM Server running on http://localhost:9000");
});