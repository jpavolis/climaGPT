const apiKey = '9ca9e9ad62e2593af164a41fb1774c72'; // Usa tu propia API Key
const weatherIcons = {
    'Clear': 'clear.svg',
    'Clouds': 'clouds.svg',
    'Rain': 'rain.svg',
    'Snow': 'snow.svg',
    'Drizzle': 'drizzle.svg',
    'Thunderstorm': 'thunderstorm.svg'
};

async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) return alert('Por favor, ingresa una ciudad');

    try {
        // Obtener datos del clima actual
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
            alert('Ciudad no encontrada');
            return;
        }

        const { main, wind, weather, coord } = weatherData;
        const probabilityRain = weatherData.rain ? (weatherData.rain['1h'] || 0) + '%' : '0%';
        const weatherType = weather[0].main;
        const backgroundImage = `url('images/${weatherType.toLowerCase()}.jpg')`;

        document.body.style.backgroundImage = backgroundImage;
        
        document.getElementById('weatherInfo').innerHTML = `
            <h3>${weatherData.name}, ${weatherData.sys.country}</h3>
            <img class="animated-icon" src="icons/${weatherIcons[weatherType] || 'default.svg'}" alt="${weatherType}">
            <p>Temperatura: ${main.temp}°C</p>
            <p>Viento: ${wind.speed} m/s</p>
            <p>Probabilidad de lluvia: ${probabilityRain}</p>
            <p>Presión atmosférica: ${main.pressure} hPa</p>
        `;

        // Obtener previsión de 7 días
        getForecast(coord.lat, coord.lon);
    } catch (error) {
        alert('Error al obtener los datos');
    }
}

async function getForecast(lat, lon) {
    try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid=${apiKey}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        let forecastHTML = '<h3>Previsión 7 días</h3>';
        forecastData.list.forEach(day => {
            const date = new Date(day.dt * 1000).toLocaleDateString('es-ES', { weekday: 'long' });
            forecastHTML += `
                <div class="forecast-day">
                    <p>${date}</p>
                    <p>${day.main.temp}°C</p>
                    <img src="icons/${weatherIcons[day.weather[0].main] || 'default.svg'}" alt="${day.weather[0].main}" width="40">
                </div>
            `;
        });

        document.getElementById('forecast').innerHTML = forecastHTML;
    } catch (error) {
        alert('Error al obtener la previsión del clima');
    }
}
