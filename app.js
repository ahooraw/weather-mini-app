const API_KEY = "yak";

const searchForm = document.querySelector(".search-form");
const cityInput = document.querySelector("#city-input");

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

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.cod !== 200) {
            showError(data.message);
            return;
        }

         displayWeather(data);
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayWeather(data) {
    const weatherIcon = document.querySelector("#weather-icon");
    const cityName = document.querySelector("#city-name");
    const description = document.querySelector("#weather-description");
    const temperature = document.querySelector("#temperature");
    const humidity = document.querySelector("#humidity");
    const windSpeed = document.querySelector("#wind-speed");
    const feelsLike = document.querySelector("#feels-like");

    
    weatherIcon.src = 
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    cityName.textContent = data.name;
    
    weatherIcon.classList.remove("hidden");
    description.textContent = data.weather[0].description;

    temperature.textContent = Math.round(data.main.temp);

    humidity.textContent = `${data.main.humidity}%`;

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


    cityName.textContent = "Error";

    description.textContent = message;

    temperature.textContent = "--";

    humidity.textContent = "--%";

    windSpeed.textContent = "--";

    feelsLike.textContent = "--°C";

    weatherIcon.classList.add("hidden");
}