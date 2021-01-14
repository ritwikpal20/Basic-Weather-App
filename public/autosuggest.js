$(".input-city").keyup(() => {
    city = $(".input-city").val();
    $.get(
        `https://autosuggest.search.hereapi.com/v1/autosuggest?at=22.9867569,87.8549755&limit=5&lang=en&q=${city}&apiKey=qFwzkhP7AxO51L2e85jGvvZOJT6SaUg-MeEJg6wn9Y4`,
        (data) => {
            $(".suggestions").empty();
            for (let i = 0; i < data.items.length; i++) {
                $(".suggestions").append(
                    `<li class="list-group-item suggested-place">${data.items[i].title}</li>`
                );
                $(".suggested-place").click((event) => {
                    $(".input-city").val($(event.target).text());
                    $(".suggestions").empty();
                });
            }
        }
    );
});
$(".input-city").keypress((event) => {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == "13") {
        $(".form").submit();
    }
});

setInterval(() => {
    if ($(".input-city").val() == "") $(".suggestions").empty();
}, 500);
