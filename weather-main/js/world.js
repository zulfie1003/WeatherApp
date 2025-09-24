let apiKey = "1e3e8f230b6064d27976e41163a82b77";
let searchinput = document.querySelector(".searchinput");
let box = document.querySelector(".box");
let normalMessage = document.querySelector(".normal-message");
let errorMessage = document.querySelector(".error-message");
let addedMessage = document.querySelector(".added-message");

// Function to get the date
let date = new Date().getDate();
let months_name = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let months = new Date().getMonth();
let year = new Date().getFullYear();

let FullDate = document.querySelector(".date");
FullDate.innerHTML = `${months_name[months]} ${date}, ${year}`;

// Weather info
async function city(cityName) {
  let url = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${apiKey}`
  );
  if (url.ok) {
    let data = await url.json();
    console.log(data);

    let cityBox = document.querySelector(".city-box");

    if (!box) {
      box = document.createElement("div");
      box.className = "box";
      cityBox.appendChild(box);
    }

    let weatherBox = document.createElement("div");
    weatherBox.className = "weather-box";

    let nameDiv = document.createElement("div");
    nameDiv.className = "name";

    let cityElement = document.createElement("div");
    cityElement.className = "city-name city";
    cityElement.innerHTML = data.name;

    let tempElement = document.createElement("div");
    tempElement.className = "weather-temp temp";
    tempElement.innerHTML = Math.floor(data.main.temp) + "°";

    let weatherIconDiv = document.createElement("div");
    weatherIconDiv.className = "weather-icon";

    let weatherImg = document.createElement("img");
    weatherImg.className = "weather";

    if (data.weather[0].main === "Rain") {
      weatherImg.src = "img/rain.png";
    } else if (data.weather[0].main === "Clear" || data.weather[0].main === "Clear Sky") {
      weatherImg.src = "img/sun.png";
    } else if (data.weather[0].main === "Snow") {
      weatherImg.src = "img/snow.png";
    } else if (
      data.weather[0].main === "Clouds" ||
      data.weather[0].main === "Smoke"
    ) {
      weatherImg.src = "img/cloud.png";
    } else if (
      data.weather[0].main === "Mist" ||
      data.weather[0].main === "Fog"
    ) {
      weatherImg.src = "img/mist.png";
    } else if (data.weather[0].main === "Haze") {
      weatherImg.src = "img/haze.png";
    } else if (data.weather[0].main === "Thunderstorm") {
      weatherImg.src = "img/thunderstorm.png";
    }

    weatherIconDiv.appendChild(weatherImg);
    nameDiv.appendChild(cityElement);
    nameDiv.appendChild(tempElement);
    weatherBox.appendChild(nameDiv);
    weatherBox.appendChild(weatherIconDiv);
    box.appendChild(weatherBox);

    return weatherBox;

  } else {
    return "";
  }
}

// recent cities management (top 10)
const RECENT_KEY = "recent_cities";
function getRecentCities(){
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch(_) { return []; }
}
function setRecentCities(list){
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch(_) {}
}
async function renderRecentCities(){
  const recent = getRecentCities();
  const cityBox = document.querySelector(".city-box");
  if (!cityBox) return;
  if (!box) {
    box = document.createElement("div");
    box.className = "box";
    cityBox.appendChild(box);
  }
  box.innerHTML = "";
  if (recent.length) {
    for (const name of recent) {
      try { await city(name); } catch(_) {}
    }
  } else {
    // seed defaults if no history
    await city("London");
    await city("Paris");
    await city("New York");
    await city("Mumbai");
    await city("Tokyo");
    setRecentCities(["Tokyo","Mumbai","New York","Paris","London"].slice(0,10));
  }
}

// add section
let section = document.querySelector(".add-section");
let navBtn = document.querySelector(".button");
let navIcon = document.querySelector(".btn-icon");

navBtn.addEventListener("click", () => {
  if (section.style.top === "-60rem") {
    section.style.top = "100px";
    navIcon.className = "fa-solid fa-circle-xmark";
  } else {
    section.style.top = "-60rem";
    navIcon.className = "fa-solid fa-circle-plus";
  }
});

searchinput.addEventListener("keydown", async function (event) {
  if (event.keyCode === 13 || event.which === 13) {
    const weatherInfo = await city(searchinput.value);
    if (weatherInfo) {
      normalMessage.style.display = "none";
      errorMessage.style.display = "none";
      addedMessage.style.display = "block";
    } else {
      normalMessage.style.display = "none";
      errorMessage.style.display = "block";
      addedMessage.style.display = "none";
    }
    box.prepend(weatherInfo);
    // keep only top 10 cards
    while (box.childElementCount > 10) {
      box.removeChild(box.lastElementChild);
    }
    // update recent list (move to front, dedupe, cap 10)
    const label = weatherInfo.querySelector('.city-name')?.textContent || (searchinput.value || '').trim();
    const recent = getRecentCities().filter(c => c.toLowerCase() !== label.toLowerCase());
    recent.unshift(label);
    setRecentCities(recent.slice(0,10));
  }
});

// initial render
renderRecentCities();