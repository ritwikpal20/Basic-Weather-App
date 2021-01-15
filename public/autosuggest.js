//Default center location at Kharagpur
lt = 22.9867569;
lg = 87.8549755;
//give location access for better auto suggest result
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        lt = position.coords.latitude;
        lg = position.coords.longitude;
    });
}

//Auto suggest everytime user changes the city value
$(".input-city").keyup(() => {
    city = $(".input-city").val();
    $.post("/autosuggest", { lt, lg, city }, (data) => {
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
                    "/",
                    {
                        city_name: $(".input-city").val(),
                        lat: $(event.target).data("latitude"),
                        lng: $(event.target).data("longitude"),
                    },
                    () => {
                        window.location.replace("/");
                    }
                );
            } else {
                $.post("/", { city_name: $(".input-city").val() }, () => {
                    window.location.replace("/");
                });
            }
            $(".suggestions").empty();
        });
    });
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

setInterval(() => {
    if ($(".input-city").val() == "") $(".suggestions").empty();
}, 500);
