# Weather-app-nodejs
Weather data application using Nodejs

For testing the application go to https://marmalade-misty-poppy.glitch.me
The site will ask you for your location and you can reset the settings after you saw the app. The app just uses it for communicating to 'Open weather' api(you can check it yourself in the codes).

For using the app you need to create a file named '.env' and save your 'Openweather' api key in this file like it shown in '.env_sample' and run the command 'node app.js' to start the server and go to http://localhost:3000/ in your browser and see the result.

A simple project for showing the weather and air quality using two APIs, Openweather and OpenAirquality.
The app loads the coordinates of the user and sends it back to server. The server connects to the APIs that were meentioned previously and merges the datas and sends it back.
The app has the ability to save the weather data corresponding to current user's coordinate to the database or user can enter another city and save the data about that specific city to database.
And user can load all the data and it will be shown on a 'leaflet' map. Click the markers on the map and the data will popup.

This is a demonstration of using APIs on server side. Doing so may hide the api key and soome other information from the client side. This was accomplished by using 'dotenv' package.
The project was more of a learning porject and it followed the "Selfie app".
