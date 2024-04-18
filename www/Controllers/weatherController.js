// Funcion de inicio

function init() {
    var onSuccess = function (position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getWeatherByCoordinates(lat, lon);
        getWeatherFiveOvecast(lat, lon);
        getWeatherAirPolution(lat, lon);
        setMapInfo(lat, lon);
    }

    function onError(error) {
        console.error("Error: " + error.message);
        let lat = 26.0340803;
        let lon = -98.455297;
        getWeatherByCoordinates(lat, lon);
        getWeatherFiveOvecast(lat, lon);
        getWeatherAirPolution(lat, lon);
        setMapInfo(lat, lon);
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function initBySearch(lat, lon) {
    getWeatherByCoordinates(lat, lon);
    getWeatherFiveOvecast(lat, lon);
    getWeatherAirPolution(lat, lon);
    setMapInfo(lat, lon);
}

// Funciones AJAX para la consulta de datos

function getCoordinatesByNameForInput(location) {
    // let url = getGeocodingDataByHttp + "direct?q=" + location + "&limit=5&appid=" + apiKey;
    let url = geocodingWeather + "?location=" + location;

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            geocodingLimitData = JSON.parse(response);
            geocodingLimitData.length > 0
                ? initBySearch(geocodingLimitData[0].lat, geocodingLimitData[0].lon)
                : loadPartialView('error404/not-found', appRender);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error in get geocoding data: " + textStatus + " - " + errorThrown);
        }
    });
}

function getCoordinatesByName(location) {
    // let url = getGeocodingDataByHttp + "direct?q=" + location + "&limit=5&appid=" + apiKey;
    let url = geocodingWeather + "?location=" + location;

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            geocodingData = JSON.parse(response);
            $('.item-result').empty();
            geocodingDataListInfo(geocodingData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error in get geocoding data: " + textStatus + " - " + errorThrown);
        }
    });
}

function getWeatherByCoordinates(lat, lon) {
    // let url = getWeatherData + "weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey;
    // let url = currentWeatherData + lat + "/" + lon;

    $.ajax({
        url: getWeatherData + 'weather',
        method: 'GET',
        dataType: 'jsonp',
        data: {
            lat: lat,
            lon: lon,
            units: 'metric',
            appid: apiKey
        },
        success: function (response) {
            weatherData = response;
            showWeatherInfo(weatherData);
            console.log("Weather data:", weatherData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error in get weather data: " + textStatus + " - " + errorThrown);
        }
    });
}

function getWeatherFiveOvecast(lat, lon) {
    // let url = getWeatherData + "forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey;

    $.ajax({
        url: getWeatherData + 'forecast',
        method: 'GET',
        dataType: 'jsonp',
        data: {
            lat: lat,
            lon: lon,
            units: 'metric',
            appid: apiKey
        },
        success: function (response) {
            fiveoverData = response;
            showWeatherFiveOvercastInfo(fiveoverData);
            // console.log("Forecast data:", fiveoverData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error in get weather data: " + textStatus + " - " + errorThrown);
        }
    });
}

function getWeatherAirPolution(lat, lon) {
    let url = currentWeatherAirPollutionData + "?lat=" + lat + "&lon=" + lon;

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            airpolutionData = JSON.parse(response);
            showWeatherAirPolutionInfo(airpolutionData);
            console.log("Air polution data:", airpolutionData);

            aqiLvl = airpolutionData.list[0].main.aqi;
            getSuggestions(aqiLvl);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error in get weather data: " + textStatus + " - " + errorThrown);
        }
    });
}

// Funciones para mostrar la información en las secciones correspondientes

function geocodingDataListInfo(response) {
    if (response.length > 0) {
        response.forEach(function (result) {
            let html = `
            <li class="item-search-list">
                <a onclick="handleItemClick(event, ${result.lat}, ${result.lon})" data-bs-dismiss="offcanvas">
                    <div class="d-flex gap-3">
                        <div class="ps-2 d-flex align-items-center justify-content-center">
                            <i class="bi bi-geo-alt-fill" style="font-size: x-large;"></i>
                        </div>
                        <div>
                            <p class="location-name m-0" style="font-size: 1rem;">${result.name}</p>
                            <p class="location-StateCountry m-0" style="font-size: small;">${result.state || ""}, ${result.country}</p>
                        </div>
                    </div>
                </a>
            </li>
            `;

            $('.item-result').append(html);
        });
    } else {
        $('.item-result').append(`
        <li class="item-search-list d-flex align-items-center justify-content-center">
            <div class="d-flex gap-3">
                <p class="m-0" style="font-size: 1rem;">No se encontraron resultados.</p>
            </div>
        </li>
        `);
    }
}

function setMapInfo(lat, lon) {
    if (map) {
        map.remove();
    }

    map = L.map('map').setView([lat, lon], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let marker = L.marker([lat, lon]).addTo(map);
}

function showWeatherAirPolutionInfo(airpolutionData) {
    // RESET

    $('#compon-pm #compon-no #compon-so #compon-o').empty();

    // AIR POLUTION SECTION

    $('#compon-pm').text(airpolutionData.list[0].components.pm2_5.toFixed(1));
    $('#compon-no').text(airpolutionData.list[0].components.no2.toFixed(1));
    $('#compon-so').text(airpolutionData.list[0].components.so2.toFixed(1));
    $('#compon-o').text(airpolutionData.list[0].components.o3.toFixed(1));
}

function showWeatherFiveOvercastInfo(fiveoverData) {
    $('.show-fiveover').empty();
    $('.card-today-at').empty();

    let counterToFiveOver = 0;
    let counterToTwentyFourForecast = 0;

    for (let i = 7; i < fiveoverData.list.length; i += 8) {
        const element = fiveoverData.list[i];
        const weatherIcon = element.weather[0].icon;

        let unixTime = element.dt;
        let date = new Date(unixTime * 1000);

        let dayOfWeek = daysOfWeek[date.getDay()];
        let dayOfMonth = date.getDate();
        let monthName = months[date.getMonth()];

        let montAndDate = dayOfMonth + ' de ' + monthName;

        let html = `
            <div class="px-2 py-2 d-flex align-items-center justify-content-between" style="font-size: small">
                <div class="d-flex gap-2">
                    <img src="Public/img/weather_icons/${weatherIcon}.png" width="25" class="fiveover-icon">
                    <h5 class="fiveover-info mb-0" style="font-weight: bold;">
                        ${parseInt(element.main.temp)}&deg;<sup>c</sup>
                    </h5>
                </div>
                <span class="fiveover-month text-body-secondary">${montAndDate}</span>
                <span class="fiveover-day text-body-secondary">${dayOfWeek}</span>
            </div>
            `;

        let showInfo = $('.show-fiveover');
        showInfo.append(html);

        counterToFiveOver++;

        if (counterToFiveOver === 5) { break; }
    }

    for (let i = 0; i < fiveoverData.list.length; i++) {
        const element = fiveoverData.list[i];
        const weatherIcon = element.weather[0].icon;

        let timeUnix = element.dt;
        let timezone = fiveoverData.city.timezone;

        let hoursFormatted = getHours(timeUnix, timezone);

        let html = `
        <div class="card-slider">
            <div class="card-glass">
                <span class="text-light">${hoursFormatted}</span>
                <h3 class="my-2"><strong><img src="Public/img/weather_icons/${weatherIcon}.png" width="55"></strong></h3>
                <span class="text-light">${parseInt(element.main.temp)}&deg;</span>
            </div>

            <div class="card-glass mt-2" style="background: #fff;">
                <span class="text-body"><strong>${hoursFormatted}</strong></span>
                <h3 class="my-2"><img src="Public/img/weather_icons/direction.png" style="font-size: x-large; transform: rotate(${element.wind.deg - 100}deg);"></h3>
                <span class="text-body"><strong>${parseInt(mps_to_kmh(element.wind.speed))} km/h</strong></span>
            </div>
        </div>
        `;

        let showInfo = $('.card-today-at');
        showInfo.append(html);

        counterToTwentyFourForecast++;

        if (counterToTwentyFourForecast === 7) { break; }
    }

}

function showWeatherInfo(weatherData) {
    // RESET

    $('#btn-save-location').empty();
    $('.status-weather, .icon-weather, .info-day, .info-city, .city-weather').empty();
    $('.sunrise-w, .sunset-w, .humidity-w, .pressure-w, .visibility-w, .feels-like-w').empty();

    // SHOW BOTTON
    let lat = weatherData.coord.lat;
    let lon = weatherData.coord.lon;
    let location = weatherData.name;
    let state = weatherData.sys.country;
    let id = getUserIdLocalStorageValue();

    locationData = {
        lat: lat,
        lon: lon,
        location1: location,
        state_city: state,
        id_user: id
    };

    if (getUserIdLocalStorageValue() != undefined) {
        $('#btn-save-location').append(`
        <a onclick="saveLocationByCoords(locationData)" class="btn-save-location text-light" style="text-decoration: none;">
            <div class="px-2 d-flex align-items-center justify-content-center rounded bg-success"
                style="width: auto; height: auto;"><i class="bi bi-plus text-light" style="font-size: x-large;"></i> Agregar
            </div>
        </a>
        `);
    }

    // TODAY SECTION

    $('.status-weather').text(parseInt(weatherData.main.temp)).append(`<span class="text-info">&deg;<sup>c</sup></span>`);
    $('.icon-weather').attr('src', `Public/img/weather_icons/${weatherData.weather[0].icon}.png`);

    let unixTime = weatherData.dt;
    let date = new Date(unixTime * 1000); // Se multiplica por 1000 para convertir segundos a milisegundos

    let dayOfWeek = daysOfWeek[date.getDay()]; // Obtener el dia de la semana
    let dayOfMonth = date.getDate(); // Obtener el numero del día
    let monthName = months[date.getMonth()]; // Obtener el nombre del mes
    let formattedDate = dayOfWeek + ', ' + dayOfMonth + ' de ' + monthName;
    console.log("Fecha:", formattedDate);

    $('.info-day').text(formattedDate);
    $('.info-city').text(weatherData.name + ", " + weatherData.sys.country);
    $('.city-weather').text(weatherData.name);

    // HIGHLIGHTS SECTION

    let unixSunrise = weatherData.sys.sunrise
    let unixSunset = weatherData.sys.sunset
    let timezone = weatherData.timezone

    $('.sunrise-w').text(`${getTime(unixSunrise, timezone)}`);
    $('.sunset-w').text(`${getTime(unixSunset, timezone)}`);
    $('.humidity-w').text(`${weatherData.main.humidity}%`);
    $('.pressure-w').text(`${weatherData.main.pressure}hPa`);
    $('.visibility-w').text(`${weatherData.visibility / 1000}km`);
    $('.feels-like-w').text(`${parseInt(weatherData.main.feels_like)}`).append(`&deg;<sup>c</sup>`);
}