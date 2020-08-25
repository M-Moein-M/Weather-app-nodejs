getWeatherData();

function getWeatherData() {
    if ('geolocation' in navigator) {
        console.log('Geolocation information available');
        navigator.geolocation.getCurrentPosition(async latlon => {
            const lat = (latlon.coords.latitude.toFixed(2)).toString();
            const lon = (latlon.coords.longitude.toFixed(2)).toString();

            const data = await requestWeatherData(lat, lon);
            updateDOM(data);
        });
    } else {
        console.log('Geolocation information not available');
    }
}

function updateDOM(data) {  // updates DOM elements with the data received from server
    // using data we got back from the server
    const lat = data.latitude;
    const lon = data.longitude;
    const openWeatherData = data.openWeatherData;
    const openAirQualityData = data.openAirQualityData;

    // updating DOM using openWeatherData
    document.getElementById('latitude').innerText = lat + '°';
    document.getElementById('longitude').innerText = lon + '°';
    document.getElementById('city-name').innerText = openWeatherData.cityName;
    document.getElementById('temperature').innerText = openWeatherData.temp + '°C';
    document.getElementById('max-temp').innerText = openWeatherData.temp_max + '°C';
    document.getElementById('min-temp').innerText = openWeatherData.temp_min + '°C';

    // updating DOM using openAirQualityData
    try {
        const qualityData = openAirQualityData.results[0];
        document.getElementById('quality-location').innerText = qualityData.location;
        document.getElementById('quality-parameter').innerText = qualityData.measurements[0].parameter;
        document.getElementById('quality-value').innerText = qualityData.measurements[0].value;
        document.getElementById('quality-unit').innerText = qualityData.measurements[0].unit;
        document.getElementById('quality-last-update').innerText = qualityData.measurements[0].lastUpdated;
        document.getElementById('air-quality-data').classList.remove('hide');
    } catch (e) {
        document.getElementById('air-quality-data').classList.add('hide');
        document.getElementById('air-quality-not-available').classList.remove('hide');
        console.log(e);
    }
}

async function requestWeatherData(lat, lon) {
    // sending fetch request to the server
    const url = `/weather/${lat},${lon}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

async function saveWeatherData(data) { // input data is same as we receive from server
    const saveDataURL = '/api/save';
    const saveResponse = await fetch(saveDataURL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),

    });
}

document.getElementById('check-in-current-coords').addEventListener('click', async function () {
    // get data using  current location of client
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (geolocation) => {
            const lat = (geolocation.coords.latitude.toFixed(2)).toString();
            const lon = (geolocation.coords.longitude.toFixed(2)).toString();
            const data = await requestWeatherData(lat, lon);
            await saveWeatherData(data);
        });
    }
});

document.getElementById('show-form').addEventListener('click', function () {
    document.getElementById('data-monitor').classList.add('hide');
    document.getElementById('new-city-div').classList.remove('hide');

});
document.getElementById('return-back').addEventListener('click', function () {
    document.getElementById('data-monitor').classList.remove('hide');
    document.getElementById('new-city-div').classList.add('hide');
});
document.getElementById('send-form').addEventListener('click', async function () {
    try {
        const cityName = document.getElementById('city-name-input').value;
        document.getElementById('city-log').innerText = 'Sending data...';
        const apiURL = `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=b5c8595f8ef94c468b95462a4728e31c`;
        const response = await fetch(apiURL);
        const data = await response.json();

        // extracting the latitude and longitude
        let latitude = data.results[0].geometry.lat.toFixed(2);
        const longitude = data.results[0].geometry.lng.toFixed(2);

        const serverResponse = await requestWeatherData(latitude, longitude);
        await saveWeatherData(serverResponse);
        document.getElementById('city-log').innerText = 'Enter you city name';
        document.getElementById('city-name-input').value = '';
    } catch (err) {
        console.log(err);
        document.getElementById('city-log').innerText = 'Enter a valid city name';
        document.getElementById('city-name-input').value = '';
        return;
    }
});