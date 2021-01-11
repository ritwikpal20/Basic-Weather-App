const bodyParser = require("body-parser");
const express = require("express");
const https = require("https");
const dotenv = require("dotenv");

if (process.env.NODE_ENV != "production") {
    dotenv.config();
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.use("/public", express.static(__dirname + "/public"));

let city = "",
    weatherDescription = "",
    imageUrl = "";
app.get("/", (req, res) => {
    res.render("index", { city, weatherDescription, imageUrl });
});

app.post("/", (req, res) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city_name}&appid=${process.env.API_KEY}`;
    https.get(url, (response) => {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            if (weatherData.cod == "404" || weatherData.cod == "400") {
                city = "No city Found";
            } else {
                city = weatherData.name;
                weatherDescription = weatherData.weather[0].description;
                imageUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
            }
            res.redirect("/");
        });
    });
});

app.listen(3000, () => {
    console.log("server started on http://localhost:3000");
});
