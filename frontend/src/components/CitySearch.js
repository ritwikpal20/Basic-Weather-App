import { useState, useEffect, useRef } from "react";
import $ from "jquery";

const CitySearch = (props) => {
    const [lt, setLT] = useState(22.9867569);
    const [lg, setLG] = useState(87.8549755);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLT(position.coords.latitude);
                setLG(position.coords.longitude);
            });
        }
        $(".input-city").keyup(() => {
            let city = $(".input-city").val();
            $.post(
                "http://172.105.47.207:5002/autosuggest",
                { lt, lg, city },
                (data) => {
                    data = JSON.parse(data);
                    $(".suggestions").empty();
                    for (let i = 0; i < data.items.length; i++) {
                        if (data.items[i].position) {
                            $(".suggestions").append(
                                `<li class="list-group-item suggested-place" data-latitude=${data.items[i].position.lat} data-longitude=${data.items[i].position.lng}>${data.items[i].title}</li>`
                            );
                        }
                    }
                    $(".suggested-place").click((event) => {
                        $(".input-city").val($(event.target).text());
                        if ($(event.target).data("latitude")) {
                            $.post(
                                "http://172.105.47.207:5002/fetch-data/",
                                {
                                    city_name: $(".input-city").val(),
                                    lat: $(event.target).data("latitude"),
                                    lng: $(event.target).data("longitude"),
                                },
                                (data) => {
                                    props.setData(data);
                                    window.localStorage.setItem(
                                        "ritwik-weather-app",
                                        JSON.stringify(data)
                                    );
                                }
                            );
                        } else {
                            $.post(
                                "http://172.105.47.207:5002/fetch-data/",
                                { city_name: $(".input-city").val() },
                                (data) => {
                                    window.localStorage.setItem(
                                        "ritwik-weather-app",
                                        JSON.stringify(data)
                                    );
                                }
                            );
                        }
                        $(".suggestions").empty();
                    });
                }
            );
        });
        $(".input-city").keypress((event) => {
            var keycode = event.keyCode ? event.keyCode : event.which;
            if (keycode == "13") {
                $.post("/", { city_name: $(".input-city").val() }, () => {
                    window.location.replace("/");
                });
            }
        });
        $("#btnSearch").click(() => {
            $.post("/", { city_name: $(".input-city").val() }, () => {
                window.location.replace("/");
            });
        });

        let inter = setInterval(() => {
            if ($(".input-city").val() == "") $(".suggestions").empty();
        }, 500);

        return () => clearInterval(inter);
    }, [lt, lg, props]);

    return (
        <>
            <div className="input-group mb-3">
                <textarea
                    type="text"
                    className="form-control input-city"
                    placeholder="City Name"
                    name="city_name"
                    rows="1"
                ></textarea>
                <button className="btn btn-dark" id="btnSearch">
                    Search
                </button>
            </div>
            <ul className="suggestions list-group"></ul>
        </>
    );
};

export default CitySearch;
