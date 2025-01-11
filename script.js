const apiKey = 'd248495d2aa544e595c71057a9f19035'; // Your Weatherbit API key
const weatherInfo = document.getElementById('weatherInfo');
const spinner = document.getElementById('spinner');
const errorDiv = document.getElementById('error');

async function fetchWeatherByCity() {
  const city = document.getElementById('cityInput').value;
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  await fetchWeatherData(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`);
}

async function fetchWeatherByLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    await fetchWeatherData(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`);
  });
}

async function fetchWeatherData(url) {
  showLoading();
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Unable to fetch weather data.");
    }
    const data = await response.json();
    displayWeather(data.data[0]);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoading();
  }
}

function displayWeather(data) {
  errorDiv.textContent = "";
  const { city_name, temp, weather, rh, wind_spd, sunrise, sunset, app_temp } = data;

  document.getElementById('cityName').textContent = city_name;
  document.getElementById('temp').textContent = temp;
  document.getElementById('feelsLike').textContent = app_temp;
  document.getElementById('description').textContent = weather.description;
  document.getElementById('humidity').textContent = rh;
  document.getElementById('wind').textContent = wind_spd;
  document.getElementById('sunrise').textContent = sunrise;
  document.getElementById('sunset').textContent = sunset;

  const iconUrl = `https://www.weatherbit.io/static/img/icons/${weather.icon}.png`;
  document.getElementById('weatherIcon').src = iconUrl;

  weatherInfo.style.display = 'block';
}

function showError(message) {
  errorDiv.textContent = message;
  weatherInfo.style.display = 'none';
}

function showLoading() {
  spinner.style.display = 'block';
  weatherInfo.style.display = 'none';
  errorDiv.textContent = '';
}

function hideLoading() {
  spinner.style.display = 'none';
}

// Particle Animation
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 1,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fill();
    particle.x += particle.dx;
    particle.y += particle.dy;

    if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();
