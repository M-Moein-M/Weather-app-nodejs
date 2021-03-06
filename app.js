const express = require('express');
const fetch = require('node-fetch');

require('dotenv').config();

// creating database
const Datastore = require('nedb');
const database = new Datastore({filename: 'database.db'});
database.loadDatabase();

app = express();

const port = process.env.port||3000;

app.use(express.static('public'));
app.use(express.json({limit: '2mb'}));

app.listen(port, function () {
    console.log(`server running on port: ${port}`);
});

app.get('/weather/:latlon', async (req, res) => {
    const parameters = req.params.latlon.split(',');
    const lat = parameters[0];
    const lon = parameters[1];
    let responseObject; // the json that we sent back for response

    // using 'open weather' api
    const api_key = process.env.OPEN_WEATHER_API_KEY;
    const openWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    const openWeatherResponse = await fetch(openWeatherUrl); // sending fetch request to 'open weather' api
    const openWeatherData = await openWeatherResponse.json(); // waiting for response from 'open weather'

    // using 'open air quality' api
    const openAirQualityUrl = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const openAirQualityResponse = await fetch(openAirQualityUrl);  // sending fetch request to 'open air quality' api
    const openAirQualityData = await openAirQualityResponse.json();  // waiting for response from 'open air quality'
    delete openAirQualityData.meta; // removing useless attribute

    // putting data form two api together and send it back to client
    responseObject = {
        latitude: lat,
        longitude: lon,
        openWeatherData: openWeatherData.main,
        openAirQualityData: openAirQualityData
    };
    responseObject.openWeatherData.cityName = openWeatherData.name;  // setting name attribute to show on DOM
    res.send(responseObject);
});


app.post('/api/save', (req, res) => {
    database.insert(req.body);
    res.send({status: 'success'});
});

app.get('/api/database', (req, res)=>{
    database.find({}, function (err, docs) {
        res.send(docs);
    });
});