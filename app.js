const bodyParser = require("body-parser");
const express = require("express");
const https = require("https");
const dotenv = require("dotenv");
const expressSession = require("express-session");

if (process.env.NODE_ENV != "production") {
    dotenv.config();
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.use(require("cors")());
app.use("/public", express.static(__dirname + "/public"));
app.use(
    expressSession({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SECRET_STRING,
    })
);

app.get("/", async (req, res) => {
    //if the user already has a city name or latitude,longitude saved in cookie , show temperation of that city by default
    if (req.session.visit) {
        if (req.session.lat && req.session.lng) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${req.session.lat}&lon=${req.session.lng}&appid=${process.env.OWM_API_KEY}&units=metric`;
        } else if (req.session.city) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${req.session.city}&appid=${process.env.OWM_API_KEY}&units=metric`;
        } else {
            res.render("index");
        }
        if ((req.session.lat && req.session.lng) || req.session.city) {
            https.get(url, (response) => {
                response.on("data", function (data) {
                    const weatherData = JSON.parse(data);
                    if (weatherData.cod == "404" || weatherData.cod == "400") {
                        req.session.city = null;
                        res.render("index");
                    } else {
                        req.session.weatherDescription =
                            weatherData.weather[0].description;
                        req.session.imageUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
                        req.session.temp = weatherData.main.temp;
                        res.render("index", {
                            city: req.session.city,
                            weatherDescription: req.session.weatherDescription,
                            imageUrl: req.session.imageUrl,
                            temp: req.session.temp,
                            country: req.session.country,
                            location: req.session.location,
                        });
                    }
                });
            });
        }
    } else {
        req.session.visit = true;
        res.render("index");
    }
});

app.post("/", (req, res) => {
    if (req.body.lat & req.body.lng) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${req.body.lat}&lon=${req.body.lng}&appid=${process.env.OWM_API_KEY}&units=metric`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city_name}&appid=${process.env.OWM_API_KEY}&units=metric`;
    }
    https.get(url, (response) => {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            if (weatherData.cod == "404" || weatherData.cod == "400") {
                req.session.city = null;
            } else {
                req.session.location = req.body.city_name;
                req.session.lat = req.body.lat;
                req.session.lng = req.body.lng;
                req.session.city = weatherData.name;
                req.session.weatherDescription =
                    weatherData.weather[0].description;
                req.session.imageUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
                req.session.temp = weatherData.main.temp;
                req.session.country = weatherData.sys.country;
            }
            res.send("data successfully stored in session , redirect to /");
        });
    });
});

app.post("/fetch-data", (req, res) => {
    if (req.body.lat & req.body.lng) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${req.body.lat}&lon=${req.body.lng}&appid=${process.env.OWM_API_KEY}&units=metric`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city_name}&appid=${process.env.OWM_API_KEY}&units=metric`;
    }
    https.get(url, (response) => {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            let fetchedData = {};
            if (weatherData.cod == "404" || weatherData.cod == "400") {
                fetchedData.city = null;
            } else {
                fetchedData.location = req.body.city_name;
                fetchedData.lat = req.body.lat;
                fetchedData.lng = req.body.lng;
                fetchedData.city = weatherData.name;
                fetchedData.weatherDescription =
                    weatherData.weather[0].description;
                fetchedData.imageUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
                fetchedData.temp = weatherData.main.temp;
                fetchedData.country = weatherData.sys.country;
            }
            res.send(fetchedData);
        });
    });
});

app.post("/autosuggest", (req, res) => {
    if (req.body.city) {
        url = `https://autosuggest.search.hereapi.com/v1/autosuggest?at=${req.body.lt},${req.body.lg}&limit=5&lang=en&q=${req.body.city}&apiKey=${process.env.HERE_API_KEY}`;
        https.get(url, (response) => {
            response.on("data", (data) => {
                res.send(data);
            });
        });
    }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log("server started on http://localhost:3000");
});
