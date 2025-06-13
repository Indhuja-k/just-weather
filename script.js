const apiKey = "e575ade9f02d367f58eb6288b92aa6d6";
let searchHistory = [];

function getWeather(cityInput) {
  const city = cityInput || document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city.");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) throw new Error("City not found");

      const { name, sys, main, weather } = data;
      document.getElementById("weatherResult").innerHTML = `
        <h2>${name}, ${sys.country}</h2>
        <p>${weather[0].description}</p>
        <p>🌡️ ${main.temp}°C | 💧 Humidity: ${main.humidity}%</p>
      `;

      addToHistory(name);
      getForecast(name);
    })
    .catch(() => {
      document.getElementById("weatherResult").innerHTML = `<p>❌ City not found.</p>`;
      document.getElementById("forecast").innerHTML = "";
    });
}

function getForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00"));
      const forecastContainer = document.getElementById("forecast");
      forecastContainer.innerHTML = "";

      forecastList.slice(0, 5).forEach(day => {
        const date = new Date(day.dt_txt);
        const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
        const icon = day.weather[0].icon;
        const temp = day.main.temp;

        forecastContainer.innerHTML += `
          <div class="forecast-card">
            <p>${weekday}</p>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="" />
            <p>${temp}°C</p>
          </div>
        `;
      });
    });
}

function addToHistory(city) {
  if (searchHistory.includes(city)) return;
  searchHistory.unshift(city);
  if (searchHistory.length > 5) searchHistory.pop();
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById("historyList");
  container.innerHTML = "";
  searchHistory.forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.onclick = () => getWeather(city);
    container.appendChild(btn);
  });
}
