// JavaScript to populate the local News
// When this function is called, the document/page should be ready to go and the user has selected a city already.

function displayNewsStories(cityID) {

    // // grab the city name but sanitize it for use as a web link (replacing spaces with %20)
    // var queryCityName = locationList[parseInt(cityID) - 1].locNameSimple.replace(/ /g, "%20");
    // queryCityName = queryCityName.replace('/', "%20");
    // queryCityName = queryCityName.replace('(', "");
    // queryCityName = queryCityName.replace(')', "");
    // queryCityName = queryCityName.replace(',', "");

    var queryCountryID = locationList[parseInt(cityID) - 1].countryCode;
    var apiKeyNews = "_fw4Xiwk0liIPfXwQdkzTrxVifcxrvyIJfd1l2cu1kuwWA6w";
    // var createURL = "https://api.currentsapi.services/v1/search?country=" + queryCountryID + "&keywords=" + queryCityName + "&language=en&apiKey=" + apiKeyNews;
    var createURL = "https://api.currentsapi.services/v1/search?country=" + queryCountryID + "&language=en&apiKey=" + apiKeyNews;

    $.ajax({
        url: createURL,
        method: "GET",
        dataType: "json"
    }).then(function (newsResponse) {

        var listULNews = document.getElementById("listStories");
        var displayText = "";

        if (newsResponse.status === "ok") {
            // Show 10 max news stories
            if (newsResponse.news.length === 0) {
                displayText = "There are no news stories for this location";
            } else {
                for (var i = 0; i < newsResponse.news.length && i < 10; i++) {
                    // build the text to be displayed
                    displayText += '<li><a href="' + newsResponse.news[i].url + '" target="blank">' + newsResponse.news[i].title + '</a></li>';
                }
            }

            listULNews.innerHTML = displayText;
        };
    });
}