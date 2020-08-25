let mymap = L.map('map').setView([0, 0], 1);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoiam9leWpvZSIsImEiOiJja2U4bGJrMDIxeHJnMnRvYnc5aG1taHV5In0.DebkKwkw8jGmEXhyfpZ3cQ'
}).addTo(mymap);

getAllData();

async function getAllData() {
    const getDatabaseURL = '/api/database';
    const response = await fetch(getDatabaseURL);
    const data = await response.json();
    for (let item of data) {
        console.log(item);
        let marker = L.marker([item.latitude, item.longitude]).addTo(mymap);
        let text = `Latitude: ${item.latitude} Longitude: ${item.longitude} City name: ${item.openWeatherData.cityName} Temperature: ${item.openWeatherData.temp}°C`;
        try{  // checks if air quality data is not available
            text += `Air quality data: At ${item.openAirQualityData.results[0].location}. The concentration of particular matter(${item.openAirQualityData.results[0].measurements[0].parameter})
            is ${item.openAirQualityData.results[0].measurements[0].value}. Data last updated on ${item.openAirQualityData.results[0].measurements[0].lastUpdated}`;
        }catch(err){
            console.log(err);
            text += '<br>NO AIR QUALITY AVAILABLE';
        }
        marker.bindPopup(text);
    }
}
