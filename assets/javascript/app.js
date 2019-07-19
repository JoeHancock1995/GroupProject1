$(document).ready(function() {
$('select').formSelect();

function search() {
    event.preventDefault();
    city = $("#city-input").val();
    console.log(city);

    var sportURL = "https://www.balldontlie.io/api/v1/teams";

    $.ajax({
        url: sportURL, 
        method: "GET"
    })
    .then(function(response) {
        var results = response;

        for (var i = 0; i < response.data.length; i++) {
            var rCity = response.data[i].city;
            if (city == rCity) {
                console.log("HECK Yeh!" + city);
                var j = i;
            }
        }
        var id = response.data[j].id;
        console.log(id);
        var logo = $("<img>");
        $("#teamName").html("<div>" + response.data[j].full_name + "</div>");
        $(logo).attr("src", "assets/images/" + response.data[j].abbreviation + ".jpg");
        $(logo).css("height", "200px");
        $(logo).css("width", "250px");
        $("#teamName").append(logo);
        $("#teamCity").html("<div>" + response.data[j].city + "</div>");
        $("#teamAbbr").html("<div>" + response.data[j].abbreviation + "</div>");

        getGames(id);
        getPlayer(response.data[j].abbreviation);
        getWeather(city);
    });
};

function getGames(a) {
    var id = a;
    console.log(id);
    var gamesURL = "https://www.balldontlie.io/api/v1/games?seasons[]=2018&per_page=100&team_ids[]=" + id;
    $.ajax({
        url: gamesURL,
        method: "GET"
    })
    .then(function(response) {
        $("#games").html("");
        
        for (var i = 81; i > 71; i--) {
            var aDiv = $("<div>").append(
                $("<p>").text("Home: " + response.data[i].home_team.full_name),
                $("<p>").text(response.data[i].home_team_score)
            );

            var bDiv = $("<div>").append(
                $("<p>").text("Visitor: " + response.data[i].visitor_team.full_name),
                $("<p>").text(response.data[i].visitor_team_score)
            );

            if (response.data[i].home_team_score > response.data[i].visitor_team_score) {
                aDiv.css("font-weight", "bold");
                aDiv.css("color", "red");
            } else {
                bDiv.css("font-weight", "bold");
                bDiv.css("color", "red");
            }

            var date = response.data[i].date;
            date = date.substring(0 , 10);
            var cDiv = $("<div>").append(
                $("<p>").text(date),
                aDiv,
                bDiv
            );

            cDiv.attr("id", "gDiv");
            $("#games").append(cDiv);
        }
    });
};

function getPlayer(a) {
    var abb = a.toLowerCase(); 
    var playerURL = "https://nba-players.herokuapp.com/players-stats-teams/" + abb;
    console.log(playerURL);
    $.ajax({
        url: playerURL,
        method: "GET"
    })
    .then(function(response) {
        $("#players").html("");
        for (var i = 0; i < response.length; i++) {
            var name = response[i].name;
            console.log(name);
            var nameSplit = name.split(" ");
            var first = nameSplit[0];
            var last = nameSplit[1];
            console.log(first + " " + last);
            var pFirst = onlyLetters(first);
            var pLast = onlyLetters(last);
            console.log(pFirst + " " + pLast);

            var newRow = $("<div>");
            var p = $("<span>").text(first + " " + last);
            $(p).attr("id", "playerName");
            var pic = $("<img>");
            $(pic).attr("src", "https://nba-players.herokuapp.com/players/" + pLast + "/" + pFirst);
            $(pic).attr("id", "playerPic");

            $(newRow).append(pic);
            $(newRow).append(p);
            $(newRow).attr("id", "player");
            $(newRow).css("float", "left");
            $(newRow).css("margin", "0 20px 20px 0");
            $(newRow).attr("class", "carousel-item");

            $("#players").append(newRow); 
            $('.carousel').carousel();      
        }
    });
};

function onlyLetters(b) {
    var a = b.toLowerCase();
    var c = [];
    
    for (var i = 0; i < a.length; i++) {
        if ((a.charCodeAt(i) >= 97 && a.charCodeAt(i) <= 122) || (a.charCodeAt(i) == 45)) {
            c[i] = a[i]; 
        }
    }
    return c.join("");
}

function getWeather(city) {
    console.log(city);
    var wCity = city;

    if (city === "Golden State") {
        wCity = "Oakland";
    } else if (city === "Indiana") {
        wCity = "Indianapolis";
    } else if (city === "LA") {
        wCity = "Los Angeles";
    } else if (city === "Minnesota") {
        wCity = "Saint Paul";
    } else if (city === "Utah") {
        wCity = "Salt Lake City";
    }
    console.log(wCity);
 
    var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + wCity + ",us&appid=053d4bb7502bca3c24eeb2d48eeeda6e";

    if (wCity === "Toronto") {
        weatherURL = "https://api.openweathermap.org/data/2.5/forecast?q=Toronto,ca&appid=053d4bb7502bca3c24eeb2d48eeeda6e";
    }
    
    $.ajax({
        url: weatherURL,
        method: "GET"
    })
    .then(function(response) {
        var results = response;
        console.log(results);
        $("#weather-API").html("");
        for (var i = 0; i < 24; i = i + 5) {
            console.log(response.list[i].main.temp);
            //(299K − 273.15) × 9/5 + 32 = 78.53°F
            var temp = (response.list[i].main.temp - 273.15) * (9/5) + 32;
            temp = parseInt(temp); 

            var newRow = $("<div>").append(
                $("<p>").text(temp),
                $("<p>").text(response.list[i].weather[0].main),
                $("<p>").text(response.list[i].weather[0].description)
            );

            $(newRow).attr("id", "weatherDiv");
            var pic = $("<img>");
            var test = response.list[i].weather[0].main;
            
            var test = test.toLowerCase(); 
            if (test == "clear") {
                $(pic).attr("src", "assets/images/wclear.jpg");
            } else if (test == "clouds") {
                $(pic).attr("src", "assets/images/wclouds.jpg");
            } else if (test == "partly cloudy") {
                $(pic).attr("src", "assets/images/wpartlycloudy.jpg");
            } else if (test == "rain") {
                $(pic).attr("src", "assets/images/wrain.jpg");
            } else if (test == "storms") {
                $(pic).attr("src", "assets/images/wstorms.jpg");
            } 
            $(newRow).append(pic);

            
            $("#weather-API").append(newRow);
            console.log(response.list[i].main.temp);
        }
    }); 
}

$(document).on("click", "#submit", search);
});

