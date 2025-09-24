let apiKey = "1e3e8f230b6064d27976e41163a82b77";

function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

function showHero(loading) {
  const loader = document.getElementById("hero-loading");
  const panel = document.getElementById("hero-current");
  if (!loader || !panel) return;
  loader.style.display = loading ? "grid" : "none";
  panel.hidden = !!loading;
}

function setCurrentUI(city, tempC, main, humidity, feelsLikeC) {
  const cityEl = document.getElementById("current-city");
  const tempEl = document.getElementById("current-temp");
  const mainEl = document.getElementById("current-main");
  const hEl = document.getElementById("current-h");
  const fEl = document.getElementById("current-f");
  if (cityEl) cityEl.textContent = city;
  if (tempEl) tempEl.textContent = Math.round(tempC) + "°";
  if (mainEl) mainEl.textContent = main;
  if (hEl) hEl.textContent = Math.round(humidity);
  if (fEl) fEl.textContent = Math.round(feelsLikeC);
}

function addHistoryRow(label, tempC) {
  const list = document.getElementById("history-list");
  if (!list) return;
  const div = document.createElement("div");
  div.className = "chip";
  div.innerHTML = `<span>${label}</span><strong>${Math.round(tempC)}°</strong>`;
  list.appendChild(div);
}

function setTrendText(text) {
  const box = document.getElementById("trend-box");
  if (box) box.textContent = text;
}

async function getCurrentByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("current_failed");
  return res.json();
}

async function getPastDailyTemps(lat, lon) {
  // Using Open‑Meteo free no‑key archive for last 3 days
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(end.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fmt = d => d.toISOString().slice(0, 10);
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${fmt(start)}&end_date=${fmt(end)}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("history_failed");
  return res.json();
}

function analyzeTrend(todayC, pastMeans) {
  // Simple heuristic: compare today with avg of previous 2 days
  const recent = pastMeans.slice(-3, -1); // previous two days
  const avg = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : todayC;
  const diff = todayC - avg;
  if (diff > 1.5) return `Warming vs recent days (+${diff.toFixed(1)}°). Likely mild to warm.`;
  if (diff < -1.5) return `Cooling vs recent days (${diff.toFixed(1)}°). Expect cooler conditions.`;
  return `Similar to recent days (${diff.toFixed(1)}°). Stable short‑term trend.`;
}

async function init() {
  setYear();
  showHero(true);
  try {
    await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(pos => resolve(pos), err => resolve(null), { timeout: 8000 });
    }).then(async (pos) => {
      let lat, lon;
      if (pos && pos.coords) {
        lat = pos.coords.latitude; lon = pos.coords.longitude;
      } else {
        // Fallback to a default (e.g., Mumbai) if permission denied
        lat = 19.076; lon = 72.8777;
      }

      const [current, past] = await Promise.all([
        getCurrentByCoords(lat, lon),
        getPastDailyTemps(lat, lon)
      ]);

      const todayC = current.main.temp;
      setCurrentUI(current.name, todayC, (current.weather?.[0]?.description || ""), current.main.humidity, current.main.feels_like);

      const dates = past.daily?.time || [];
      const means = past.daily?.temperature_2m_mean || [];
      // Render last 3 entries (excluding today if present at end)
      const entries = dates.map((d, i) => ({ d, t: means[i] })).slice(-3);
      document.getElementById("history-list").innerHTML = "";
      entries.forEach(e => addHistoryRow(new Date(e.d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), e.t));

      setTrendText(analyzeTrend(todayC, means));
      // On this day articles
      loadOnThisDay();
    });
  } catch (_) {
    setTrendText("Unable to load data. Please check permissions or network.");
  } finally {
    showHero(false);
  }
}

document.addEventListener("DOMContentLoaded", init);

function eventLooksWeatherRelated(text) {
  const t = (text || "").toLowerCase();
  const keys = [
    "storm", "hurricane", "cyclone", "typhoon", "tornado", "rain", "snow", "blizzard", "hail", "heatwave", "heat wave", "cold wave", "coldwave", "flood", "drought", "wildfire", "smog", "air quality", "pollution", "temperature", "weather", "monsoon"
  ];
  return keys.some(k => t.includes(k));
}

async function loadOnThisDay() {
  try {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();
    const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("otd_failed");
    const data = await res.json();
    const list = document.getElementById("otd-list");
    if (!list) return;
    list.innerHTML = "";
    const items = (data.events || [])
      .map(ev => {
        const desc = ev.text || (ev.pages?.[0]?.extract) || "";
        const link = ev.pages?.[0]?.content_urls?.desktop?.page || ev.pages?.[0]?.canonicalurl || null;
        return { year: ev.year, desc, link };
      })
      .filter(it => eventLooksWeatherRelated(it.desc))
      .slice(0, 6);
    if (!items.length) {
      const p = document.createElement("p");
      p.className = "muted";
      p.textContent = "No notable weather/environment events found for this date.";
      list.appendChild(p);
      return;
    }
    items.forEach(it => {
      const a = document.createElement("a");
      a.className = "otd-item";
      a.href = it.link || "#";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = `
        <div class="otd-meta"><i class="fa-solid fa-book-open"></i><span>${it.year}</span></div>
        <h4>${it.desc}</h4>
      `;
      list.appendChild(a);
    });
  } catch (_) {
    const list = document.getElementById("otd-list");
    if (list) {
      list.innerHTML = "<p class=\"muted\">Unable to load On This Day events.</p>";
    }
  }
}


