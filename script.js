const apiKey = '9ca9e9ad62e2593af164a41fb1774c72'; // Usa tu propia API Key
const weatherIcons = {
    'Clear': 'clear.svg',
    'Clouds': 'clouds.svg',
    'Rain': 'rain.svg',
    'Snow': 'snow.svg',
    'Drizzle': 'drizzle.svg',
    'Thunderstorm': 'thunderstorm.svg'
};

// Función para obtener sugerencias de ciudades
async function getCitySuggestions(query) {
    if (query.length < 3) {
        document.getElementById('suggestions').innerHTML = '';
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    let suggestionsHTML = '';
    data.list.forEach(city => {
        suggestionsHTML += `<p onclick="selectCity('${city.name}, ${city.sys.country}')">${city.name}, ${city.sys.country}</p>`;
    });

    document.getElementById('suggestions').innerHTML = suggestionsHTML;
}

// Función para seleccionar una ciudad del autocompletado
function selectCity(city) {
    document.getElementById('city').value = city;
    document.getElementById('suggestions').innerHTML = '';
}

// Obtener datos del clima
async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) return alert('Por favor, ingresa una ciudad');

    try {
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
        
        // Actualizar el color de fondo según la temperatura
        updateBackground(main.temp);

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

// Obtener previsión del clima a 7 días
async function getForecast(lat, lon) {
    try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid=${apiKey}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        let forecastHTML = '<h3>Previsión 7 días</h3>';
        forecastData.list.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' }); // Mostrar en español

            forecastHTML += `
                <div class="forecast-day">
                    <p>${dayName.charAt(0).toUpperCase() + dayName.slice(1)}</p>
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

// Cambiar fondo según temperatura
function updateBackground(temp) {
    const body = document.getElementById('body');

    if (temp <= 10) {
        body.style.background = 'linear-gradient(to right, #2b5876, #4e4376)';
    } else if (temp > 10 && temp <= 20) {
        body.style.background = 'linear-gradient(to right, #1e3c72, #2a5298)';
    } else if (temp > 20 && temp <= 30) {
        body.style.background = 'linear-gradient(to right, #ff9800, #ff5722)';
    } else {
        body.style.background = 'linear-gradient(to right, #d32f2f, #ff5252)';
    }
}
