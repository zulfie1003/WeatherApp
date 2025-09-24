let apiKey = "1e3e8f230b6064d27976e41163a82b77";

navigator.geolocation.getCurrentPosition(async function (position) {
   
    try {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        //longitude and  latitude are used to get city name
        var map = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`)
        var userdata = await map.json();
        let loc = userdata[0].name;
        //By using City name  we can get the weather details of that particular city from OpenWeatherMap API
        let url = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&`;
        let respond = await fetch(url + `q=${loc}&` + `appid=${apiKey}`);
        let data = await respond.json();

        console.log(data);
        
        // display current weather info
        let cityMain = document.getElementById("city-name");
        let cityTemp = document.getElementById("metric");
        let weatherMain = document.querySelectorAll("#weather-main");
        let mainHumidity = document.getElementById("humidity");
        let mainFeel = document.getElementById("feels-like");
        let weatherImg = document.querySelector(".weather-icon");
        let weatherImgs = document.querySelector(".weather-icons");
        let tempMinWeather = document.getElementById("temp-min-today");
        let tempMaxWeather = document.getElementById("temp-max-today");

        cityMain.innerHTML = data.city.name;
        cityTemp.innerHTML = Math.floor(data.list[0].main.temp) + "°";
        weatherMain[0].innerHTML = data.list[0].weather[0].description;
        weatherMain[1].innerHTML = data.list[0].weather[0].description;
        mainHumidity.innerHTML = Math.floor(data.list[0].main.humidity);
        mainFeel.innerHTML = Math.floor(data.list[0].main.feels_like);
        tempMinWeather.innerHTML = Math.floor(data.list[0].main.temp_min) + "°";
        tempMaxWeather.innerHTML = Math.floor(data.list[0].main.temp_max) + "°";

        let weatherCondition = data.list[0].weather[0].main.toLowerCase();

        if (weatherCondition === "rain") {
            weatherImg.src = "img/rain.png";
            weatherImgs.src = "img/rain.png";
        } else if (weatherCondition === "clear" || weatherCondition === "clear sky") {
            weatherImg.src = "img/sun.png";
            weatherImgs.src = "img/sun.png";
        } else if (weatherCondition === "snow") {
            weatherImg.src = "img/snow.png";
            weatherImgs.src = "img/snow.png";
        } else if (weatherCondition === "clouds" || weatherCondition === "smoke") {
            weatherImg.src = "img/cloud.png";
            weatherImgs.src = "img/cloud.png";
        } else if (weatherCondition === "mist" || weatherCondition === "Fog") {
            weatherImg.src = "img/mist.png";
            weatherImgs.src = "img/mist.png";
        } else if (weatherCondition === "haze") {
            weatherImg.src = "img/haze.png";
            weatherImgs.src = "img/haze.png";
        } else if (weatherCondition === "thunderstorm") {
            weatherImg.src = "img/thunderstorm.png";
            weatherImgs.src = "img/thunderstorm.png";
        }

        // Fetch and display 5-day forecast data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${data.city.name}&appid=${apiKey}&units=metric`;

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                console.log("5-Day Forecast for", data.city.name);
                displayForecast(data);
            })
            .catch(error => {
                console.error("Error fetching forecast:", error);
            });

        function displayForecast(data) {
            const dailyForecasts = {};
            let forecast = document.getElementById('future-forecast-box');
            let forecastbox = "";

            data.list.forEach(item => {
                const date = item.dt_txt.split(' ')[0];
                let dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                let day = new Date(date).getDay();

                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = {
                        day_today: dayName[day],
                        temperature: Math.floor(item.main.temp) + "°",
                        description: item.weather[0].description,
                        weatherImg: item.weather[0].main.toLowerCase()
                    };
                }
            });

            for (const date in dailyForecasts) {
                let imgSrc = "";

                switch (dailyForecasts[date].weatherImg) {
                    case "rain":
                        imgSrc = "img/rain.png";
                        break;
                    case "clear":
                    case "clear sky":
                        imgSrc = "img/sun.png";
                        break;
                    case "snow":
                        imgSrc = "img/snow.png";
                        break;
                    case "clouds":
                    case "smoke":
                        imgSrc = "img/cloud.png";
                        break;
                    case "mist":
                        imgSrc = "img/mist.png";
                        break;
                    case "haze":
                        imgSrc = "img/haze.png";
                        break;
                    case "thunderstorm":
                        imgSrc = "img/thunderstorm.png";
                        break;
                    default:
                        imgSrc = "img/sun.png";
                }

                forecastbox += `
                <div class="weather-forecast-box">
                <div class="day-weather">
                <span>${dailyForecasts[date].day_today}</span>
                 </div>
                    <div class="weather-icon-forecast">
                        <img src="${imgSrc}" />
                    </div>
                    <div class="temp-weather">
                        <span>${dailyForecasts[date].temperature}</span>
                    </div>
                    <div class="weather-main-forecast">${dailyForecasts[date].description}</div>
                </div>`;
            }

            forecast.innerHTML = forecastbox;

            console.log(data);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
},
() => {
    // Handle location retrieval error
    alert("Please turn on your location and refresh the page");
  });

// Hourly forecast (next 24h) renderer using existing 5-day forecast data
async function renderHourlyForCity(cityName) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const hours = data.list.slice(0, 8);
        const host = document.getElementById("hourly-forecast");
        if (!host) return;
        host.innerHTML = hours.map(item => {
            const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit" });
            const m = (item.weather?.[0]?.main || "").toLowerCase();
            let icon = "img/sun.png";
            if (m.includes("rain")) icon = "img/rain.png";
            else if (m.includes("snow")) icon = "img/snow.png";
            else if (m.includes("cloud")) icon = "img/cloud.png";
            else if (m.includes("mist") || m.includes("fog")) icon = "img/mist.png";
            else if (m.includes("haze")) icon = "img/haze.png";
            else if (m.includes("thunder")) icon = "img/thunderstorm.png";
            return `
                <div class="hour">
                    <time>${time}</time>
                    <img src="${icon}" alt="" />
                    <div>${Math.round(item.main.temp)}°</div>
                </div>
            `;
        }).join("");
    } catch (_) {}
}

// Auto-render hourly when city name is set on page
document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("city-name");
    if (el) {
        const city = el.textContent || "";
        if (city) renderHourlyForCity(city);
    }
    // Q&A solution toggles
    document.querySelectorAll('.solution-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const qa = btn.closest('.qa');
            if (!qa) return;
            const sol = qa.querySelector('.solution');
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            btn.textContent = expanded ? 'Show solution' : 'Hide solution';
            if (sol) sol.hidden = expanded;
        });
    });
});