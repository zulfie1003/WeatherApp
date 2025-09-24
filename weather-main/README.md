# Weather App

Welcome to the Weather App! A frontend-only web app for real-time weather, short-term trends, and city exploration, powered by OpenWeather.

## Features

- **Live Weather (Today)**: Current conditions, feels-like, humidity, min/max, and condition icons (`index.html`).
- **6-Day Forecast**: Scrollable forecast cards with icons.
- **Hourly Forecast (24h)**: Compact hourly grid with temperature and icons.
- **Search with Typeahead**: Smart suggestions using OpenWeather Geocoding as you type (`search.html`).
- **World/Explore**: Add multiple cities and see their weather in a grid (`world.html`).
- **Home (Intro + Trends + Articles)**: A colorful homepage with intro, geolocated current snapshot, recent history, and Wikipedia “On this day” weather/environment events (`home.html`).
- **Responsive UI + Hover Effects**: Modern, responsive layout with interactive states and a sticky top navigation.

## Pages

- `home.html` – Intro, local snapshot, historical comparison, trends, and articles.
- `index.html` – Main weather screen (today, 6-day, hourly, insights) with sidebar Q&A.
- `search.html` – Search by city with live suggestions and detailed info.
- `world.html` – Add and view multiple cities.

## Tech

- **Frontend**: HTML, CSS, JavaScript (no framework)
- **API**: [OpenWeather](https://openweathermap.org/) (Current, Forecast, Geocoding)
- **Articles**: Wikipedia On-This-Day REST API (no key required)
- **Icons**: [Font Awesome](https://fontawesome.com/)

## Prerequisites

- A modern browser
- An OpenWeather API key: https://home.openweathermap.org/api_keys

## Running Locally

Geolocation and some browser APIs require HTTPS or `http://localhost`.

- Option 1: VS Code Live Server (recommended)
  - Open the folder in VS Code, Right-click `home.html` → “Open with Live Server”.
- Option 2: Python HTTP server
  ```bash
  cd /path/to/weather-main
  python3 -m http.server 8080
  ```
  Then open `http://localhost:8080/home.html` (or `index.html`, `search.html`, `world.html`).

## Configuration (API Key)

Update the `apiKey` value in these files:
- `js/main.js`
- `js/search.js`
- `js/world.js`
- `js/home.js`

Example:
```javascript
let apiKey = "YOUR_API_KEY_HERE";
```

Tip: quick replace across the project for `apiKey` if needed.

## Usage

- Start at `home.html` for an overview and local snapshot. Allow location for best results.
- Go to `index.html` for detailed today view, 6‑day forecast, and hourly changes.
- Use `search.html` and start typing to see city suggestions; press Enter or click a suggestion to view details.
- Use `world.html` to add multiple cities and compare.

## Notes

- If geolocation is blocked, home falls back to a default location.
- Wikipedia events are filtered for weather/environment keywords and may vary by date.
- Caching: Some pages may use the browser cache (e.g., suggestions via the API or your own cache implementation).

## Project Structure (high level)

- `home.html`, `index.html`, `search.html`, `world.html`
- `css/` – `home.css`, `style.css`, `search.css`, `world.css`
- `js/` – `home.js`, `main.js`, `search.js`, `world.js`
- `img/` – weather icons

## License

This project is for educational/demo purposes. Ensure your API usage complies with OpenWeather terms.

## Contact

- Email: zulfiquar.ali1823@gmail.com
- GitHub: [@zulfie1003](https://github.com/zulfie1003)
- LinkedIn: [Zulfiquar Ali](https://www.linkedin.com/in/zulfiquar-ali-931774281/)
- Portfolio: https://zulfie1003.github.io/portfolio/
