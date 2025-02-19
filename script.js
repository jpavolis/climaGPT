const apiKey = '651b77eedc537d0271887cc2c5966d4b';
const weatherIcons = {
    'Clear': 'clear.svg',
    'Clouds': 'clouds.svg',
    'Rain': 'rain.svg',
    'Snow': 'snow.svg',
    'Drizzle': 'drizzle.svg',
    'Thunderstorm': 'thunderstorm.svg'
};

async function getWeather() {
    const city = document.getElementById('city').value.trim();
    if (!city) return alert('Por favor, ingresa una ciudad');

    const url = `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            alert('Ciudad no encontrada');
            return;
        }

        const { main, wind, weather } = data;
        const probabilityRain = data.rain ? (data.rain['1h'] || 0) + '%' : '0%';
        const weatherType = weather.length > 0 ? weather[0].main : 'Clear';
        const backgroundImage = `url('images/${weatherType.toLowerCase()}.jpg')`;

        document.body.style.backgroundImage = backgroundImage;

        document.getElementById('weatherInfo').innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <img class="animated-icon" src="icons/${weatherIcons[weatherType] || 'default.svg'}" alt="${weatherType}">
            <p>Temperatura: ${main.temp}°C</p>
            <p>Viento: ${wind.speed} m/s</p>
            <p>Probabilidad de lluvia: ${probabilityRain}</p>
            <p>Presión atmosférica: ${main.pressure} hPa</p>
        `;
    } catch (error) {
        alert('Error al obtener los datos');
        console.error(error);
    }
}
