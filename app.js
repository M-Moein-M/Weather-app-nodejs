const express = require('express');
const fetch = require('node-fetch');
app = express();
const port = 3000;
app.use(express.static('public'));
app.use(express.json({limit: '2mb'}));

app.listen(port, function () {
    console.log(`server running on port: ${port}`);
});

app.get('/weather/:latlon', async (req, res) => {
    const parameters = req.params.latlon.split(',');
    const lat = parameters[0];
    const lon = parameters[1];

    const api_key = 'd328f2c99bab8eddaaf22e3a0ae087a8';
    const weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    const response = await fetch(weather_url);
    const data = await response.json();

    let response_object = data.main;
    response_object.cityName = data.name;

    res.send(response_object);
});
