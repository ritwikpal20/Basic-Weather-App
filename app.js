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
app.use("/public", express.static(__dirname + "/public"));
app.use(
    expressSession({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SECRET_STRING,
    })
);

app.get("/", (req, res) => {
    if (req.session.visit) {
        res.render("index", {
            city: req.session.city,
            weatherDescription: req.session.weatherDescription,
            imageUrl: req.session.imageUrl,
            temp: req.session.temp,
            country: req.session.country,
        });
    } else {
        req.session.visit = true;
        req.session.city = "";
        req.session.weatherDescription = "";
        req.session.imageUrl = "";
        req.session.temp = "";
        req.session.country = "";
        res.render("index");
    }
});

app.post("/", (req, res) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city_name}&appid=${process.env.API_KEY}&units=metric`;
    https.get(url, (response) => {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            if (weatherData.cod == "404" || weatherData.cod == "400") {
                req.session.city = null;
            } else {
                req.session.city = weatherData.name;
                req.session.weatherDescription =
                    weatherData.weather[0].description;
                req.session.imageUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
                req.session.temp = weatherData.main.temp;
                req.session.country = weatherData.sys.country;
            }
            res.redirect("/");
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("server started on http://localhost:3000");
});
