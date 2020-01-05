// JavaScript by Len Smith for paseoGO

var selectedCity = "";
var locationList = [];

// Wait for the window to load
$(window).on('load', function () {
    // function to load the city locations to local storage for further use
    locationList = getLocationList();
    filterLocation(locationList);
});

function filterLocation(locationList) {
    // function to filter the city/location list as the user types so they can select the desired location such as Richmond, VA [US] vs. Richmond upon Thames [UK] vs. Richmond, CA [US]

    (function () {

        var list = locationList,
            filteredList = [],
            maxDisplayLimit = 10,
            textInput = document.getElementById("inputCity"),
            displayList = document.getElementById("listLocations"),
            countMessage = document.getElementById("countMessage");

        function generateCountMessage() {
            var msg = "",
                matches = filteredList.length;
            switch (true) {
                case (matches === 0):
                    msg = "No locations found";
                    break;
                case (matches === 1):
                    msg = "Showing 1 location";
                    break;
                case (matches <= maxDisplayLimit):
                    msg = "Showing " + filteredList.length + " locations";
                    break;
                default:
                    msg = "Showing " + maxDisplayLimit + " of " + matches + " locations";
            }
            countMessage.textContent = msg;
        }

        function generateListItem(item) {
            var li = document.createElement("li"),
                spanName = document.createElement("span"),
                spanRegion = document.createElement("span"),
                spanCountry = document.createElement("span");

            spanName.classList.add("nameLocation");
            spanName.id = item.locIndex;
            spanRegion.classList.add("nameRegion");
            spanCountry.classList.add("nameCountry");
            spanName.textContent = item.locNameSimple;
            // Omit the subregion from display if it is blank
            if (item.subRegion === "") {
                spanRegion.textContent = "";
            } else {
                spanRegion.textContent = ", " + item.subRegion;
            }
            spanCountry.textContent = "  [" + item.countryCode + "]";
            li.appendChild(spanName);
            li.appendChild(spanRegion);
            li.appendChild(spanCountry);
            return li;
        }

        function generateList() {
            var frag = document.createDocumentFragment();
            for (var i = 0; i < filteredList.length; i++) {
                if (i < maxDisplayLimit) {
                    var item = filteredList[i],
                        li = generateListItem(item);
                    frag.appendChild(li);
                }
                else break;
            }
            displayList.innerHTML = "";
            displayList.appendChild(frag);
            generateCountMessage();
        }

        function textMatch(item) {
            var searchTerm = textInput.value.toLowerCase(),
                // Only make the location name (city) searchable
                itemText = item.locNameSimple.toLowerCase();
            // Only add the subRegion for searching if it is NOT blank
            if (item.subRegion !== "") {
                itemText += ", " + item.subRegion.toLowerCase();
            }
            itemText += " [" + item.countryCode.toLowerCase() + "]";
            return itemText.indexOf(searchTerm) !== -1;
        }

        function getFilteredItems() {
            filteredList = list.filter(textMatch);
            generateList();

            // Wait for an item in the filtered list to be clicked
            $(document).ready(function () {
                $("li").click(function (event) {
                    selectedCity = event.target.id;
                    console.log("selectedCity: " + selectedCity);
                    getHolidays(selectedCity, "05/01/2020", "05/31/2020");
                    displayNewsStories(selectedCity);
                });
            });
        }

        textInput.addEventListener("keyup", getFilteredItems);
        getFilteredItems();

    })();
}

function getHolidays(cityIndex, startDate, endDate) {
    // function to display the local (country) holidays during the selected dates

    // Pulls the array entry for the selected city
    //   locIndex / countryCode / cityCode / countryName / 
    //   locNameUnicode / locNameSimple / subRegion / latitude / longitude
    var myCityInfo = locationList[parseInt(cityIndex) - 1];
    var myCountry = myCityInfo.countryCode;
    const calendarAPI = "5fe6ae35d5ad0c8ab7d8eb27bd7b62589b405006";
    var myYear = startDate.substr(startDate.length - 4);
    var myMonth = startDate.substr(0, 2);
    var queryURL = "https:" + "//calendarific.com/api/v2/holidays/?api_key=" + calendarAPI + "&country=" + myCountry + "&year=" + myYear + "&month=" + myMonth + "&location=all";

    // AJAX call to get the holiday info
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (eventList) {

        // Build the holiday listing with date (yyyy-mm-dd: holidayName)
        // year-month-day: name WHERE locations = "All"

        var displayText = "";
        if (eventList.response.holidays.length < 1) {
            displayText = "There are no holidays for this month";
        }
        var listUL = document.getElementById("listHolidays");

        for (var i = 0; i < eventList.response.holidays.length; i++) {
            // Add year to holiday text to be displayed (presumed 4-digits)
            displayText += "<li>" + (eventList.response.holidays[i].date.datetime.year).toString() + '.';
            // Add month with leading zero if needed
            if (eventList.response.holidays[i].date.datetime.month < 10) {
                displayText += '0';
            }
            displayText += (eventList.response.holidays[i].date.datetime.month).toString() + '.';
            // Add day with leading zero if needed
            if (eventList.response.holidays[i].date.datetime.day < 10) {
                displayText += '0';
            }
            displayText += (eventList.response.holidays[i].date.datetime.day).toString() + ': ';
            // Add the holiday name
            displayText += eventList.response.holidays[i].name + "</li>";
        }

        listUL.innerHTML = displayText;

    });

}
