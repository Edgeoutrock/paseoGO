$(document).ready(function () {
    var apiKey = "_fw4Xiwk0liIPfXwQdkzTrxVifcxrvyIJfd1l2cu1kuwWA6w";

    $("#submitWeather0").click(function () {

        var currencyCode = $(".currency-selector").val();
        var currencyCode1 = $(".currency-selector1").val();
        var $convertCurrency = $("#artCity0").val();

        var createArt0 = "https://api.exchangerate-api.com/v4/latest/" + currencyCode;
        var cityName0 = $("<li>" + currencyCode + " converted to " + currencyCode1 + "</li>");
        $("#searchedCities0").append(cityName0);

        $.ajax({

            url: createArt0,
            method: "GET",
            dataType: "json"
        }).then(function (weatherPoint0) {
            var $spanAppend0 = $("#Riches0");
            var $titleH4 = $("h4");
            /* ATP this is right work for one card to all cards 
            $spanAppend.text(weatherPoint.rates['JPY']);
            console.log(weatherPoint.rates['JPY']);   
            $("#seachedCities").append($spanAppend); */

            function conversionCur($converCurrency) {

                var currency4Change = weatherPoint0.rates[currencyCode1];
                var result = $convertCurrency * currency4Change;

                return "returned is now " + result;
            };

            $spanAppend0.each(function (i) {
                $(this).text(weatherPoint0.rates[currencyCode1] + " " + currencyCode1 + " is equivalent to 1 " + currencyCode + " and  " + currencyCode1 + " " + conversionCur($convertCurrency));
            });

            $titleH4.each(function (i) {
                $(this).text("Conversion");
            });

            /* https://stackoverflow.com/questions/7861032/loop-and-get-key-value-pair-for-json-array-using-jquery */

        }); // end to first ajax then

    }); // end the click button search

});