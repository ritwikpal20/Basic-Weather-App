# Weather App

This app is based on how a server makes request to external server of [OpenWeatherMap](https://openweathermap.org/) to fetch data , and about setting up API Keys.This app also auto suggest places as user types with help of [Here Geocoding & Search API](https://developer.here.com/documentation/geocoding-search-api/dev_guide/index.html).

-   Give access to location for better auto suggest places.

## Development on local machine

This requires setting up a .env file ,which may contain private key, passwords,etc as :

```
NODE_ENV= development
OWM_API_KEY= *Your API key from OpenWeatherMap *
HERE_API_KEY
SECRET_STRING=*Your secret string for encrypting cookies*
```

## For Production

All the environment variables are already set on Heroku

_[Click Here For Live Site](https://weather-app-by-ritwik.herokuapp.com/)_
