const API_KEY = "5ecf24c82666cae97ec715bd57232f89";


const historySection = document.querySelector(".search-history");
const historyList = document.querySelecلهفtor("#history-list");
const clearHistoryButton = document.querySelector("#clear-history");
const searchForm = document.querySelector(".search-form");
const cityInput = document.querySelector("#city-input");
const locationButton = document.querySelector("#location-button");
const loading = document.querySelector("#loading");

locationButton.addEventListener("click", () => {
    getUserLocation();
});

clearHistoryButton.addEventListener("click", () => {

    localStorage.removeItem("weatherSearches");

    renderSearchHistory();
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        return;
    }

    getWeather(city);
});

async function getWeather(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    showLoading();
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.cod !== 200) {
            showError(data.message);
            hideLoading()

            return;
        }

         displayWeather(data);
         hideLoading()
         saveSearch(data.name);
    } catch (error) {
        console.error("Error:", error);
        showError("Something went wrong. Please try again.");
        hideLoading();
    }
}

function displayWeather(data) {
    const tempMin = document.querySelector("#temp-min");
    const tempMax = document.querySelector("#temp-max");
    const country = document.querySelector("#country");
    const weatherCondition = data.weather[0].main.toLowerCase();
    const weatherIcon = document.querySelector("#weather-icon");
    const cityName = document.querySelector("#city-name");
    const description = document.querySelector("#weather-description");
    const temperature = document.querySelector("#temperature");
    const humidity = document.querySelector("#humidity");
    const windSpeed = document.querySelector("#wind-speed");
    const feelsLike = document.querySelector("#feels-like");
    const sunrise = document.querySelector("#sunrise");
    const sunset = document.querySelector("#sunset");


    
    weatherIcon.src = 
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    cityName.textContent = data.name;
    setWeatherTheme(weatherCondition);
    weatherIcon.classList.remove("hidden");
    description.textContent = data.weather[0].description;
    sunrise.textContent = formatTime(data.sys.sunrise);
    sunset.textContent = formatTime(data.sys.sunset);
    temperature.textContent = Math.round(data.main.temp);
    humidity.textContent = `${data.main.humidity}%`;
    tempMin.textContent = `${Math.round(data.main.temp_min)}°C`;
    tempMax.textContent = `${Math.round(data.main.temp_max)}°C`;
    country.textContent = data.sys.country;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

}

function showError(message) {

    const cityName = document.querySelector("#city-name");
    const description = document.querySelector("#weather-description");
    const temperature = document.querySelector("#temperature");
    const humidity = document.querySelector("#humidity");
    const windSpeed = document.querySelector("#wind-speed");
    const feelsLike = document.querySelector("#feels-like");
    const weatherIcon = document.querySelector("#weather-icon");
    const tempMin = document.querySelector("#temp-min");
    const tempMax = document.querySelector("#temp-max");
    const country = document.querySelector("#country");
    const sunrise = document.querySelector("#sunrise");
    const sunset = document.querySelector("#sunset");


    cityName.textContent = "Error";

    description.textContent = message;

    temperature.textContent = "--";

    humidity.textContent = "--%";

    windSpeed.textContent = "--";

    feelsLike.textContent = "--°C";
    tempMin.textContent = "--°C";
    tempMax.textContent = "--°C";
    country.textContent = "--";
    sunrise.textContent = "--:--";
    sunset.textContent = "--:--";
    weatherIcon.classList.add("hidden");
}

function setWeatherTheme(condition) {

    const body = document.body;

    body.className = "";

    switch (condition) {

        case "clear":
            body.classList.add("weather-clear");
            break;

        case "clouds":
            body.classList.add("weather-clouds");
            break;

        case "rain":
        case "drizzle":
            body.classList.add("weather-rain");
            break;

        case "snow":
            body.classList.add("weather-snow");
            break;

        case "thunderstorm":
            body.classList.add("weather-thunderstorm");
            break;

        default:
            body.classList.add("weather-default");
    }
}


function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getUserLocation() {

    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            getWeatherByLocation(latitude, longitude);
        },
        () => {
            showError("Unable to access your location.");
        }
    );
}

async function getWeatherByLocation(latitude, longitude) {

    const API_URL =
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
    showLoading()
    try {

        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.cod !== 200) {
            showError(data.message);
            hideLoading()
            return;
        }

        displayWeather(data);
        hideLoading()
    } catch (error) {

        console.error("Error:", error);
        showError("Something went wrong. Please try again.");
        hideLoading()

    }
}

function showLoading() {
    loading.classList.remove("hidden");
    searchForm.querySelector("button").disabled = true;
    locationButton.disabled = true;
}

function hideLoading() {
    loading.classList.add("hidden");
    searchForm.querySelector("button").disabled = false;
    locationButton.disabled = false;
}

function saveSearch(city) {

    let searches = JSON.parse(
        localStorage.getItem("weatherSearches")
    ) || [];

    searches = searches.filter(
        search => search.toLowerCase() !== city.toLowerCase()
    );

    searches.unshift(city);
    searches = searches.slice(0, 5);
    localStorage.setItem(
        "weatherSearches",
        JSON.stringify(searches)
    );

    renderSearchHistory();
}

function renderSearchHistory() {

    const searches = JSON.parse(
        localStorage.getItem("weatherSearches")
    ) || [];

    historyList.innerHTML = "";

    if (searches.length === 0) {
        historySection.classList.add("hidden");
        return;
    }

    historySection.classList.remove("hidden");

    searches.forEach(city => {

        const button = document.createElement("button");

        button.type = "button";
        button.classList.add("history-item");

        button.textContent = city;

        button.addEventListener("click", () => {
            getWeather(city);
        });

        historyList.appendChild(button);
    });
}

renderSearchHistory();