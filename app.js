const API_KEY = "YOUR_API_KEY";

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

        console.log(data);
    } catch (error) {
        console.error("Error:", error);
    }
}