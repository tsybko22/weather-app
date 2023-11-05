const API_KEY = '0fe8f75e23d447e8a0b122151232910';

const weatherInfoElem = document.querySelector('.weather-info');
const forecastInfoElem = document.querySelector('.forecast__info');
const forecastDailyList = document.querySelector('.forecast-daily');
const forecastLocationForm = document.querySelector('.forecast-daily__form');
const forecastLocationInput = document.querySelector('.forecast-daily__input');

const getCurrentDate = () => {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
  const currentYear = new Date().toLocaleDateString('en-US', { year: 'numeric' });
  const currentDay = new Date().toLocaleDateString('en-US', { day: 'numeric' });
  const currentWeekday = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const date = {
    currentWeekday,
    currentDate: `${currentDay} ${currentMonth} ${currentYear}`,
  };

  return date;
};

const getWeekdayByDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
};

const getForecastByLocation = async (location) => {
  try {
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=5&aqi=no&alerts=no`;

    const res = await fetch(API_URL, { mode: 'cors' });
    if (!res.ok) {
      const message = `An error has occurred: ${res.statusText}`;
      throw new Error(message);
    }
    const data = await res.json();

    return data;
  } catch (err) {
    alert(err.message);
  }
};

const createWeatherIcon = (className, code) => {
  let iconName = 'sun';

  if ((code >= 1003 && code <= 1030) || code === 1135 || code === 1147) {
    iconName = 'cloud-sun';
  }
  if ((code >= 1063 && code <= 1117) || code >= 1150) {
    iconName = 'cloud-rain';
  }

  const iconHTML = `
    <svg class="${className} icon">
      <use xlink:href="#${iconName}"></use>
    </svg>
  `;

  return iconHTML;
};

const updateCurrentWeatherUI = ({ current, location }) => {
  const weatherInfoTopHTML = `
    <span class="weather-info__day">${getCurrentDate().currentWeekday}</span>
    <span class="weather-info__date">${getCurrentDate().currentDate}</span>
    <span class="weather-info__location">
      <svg class="weather-info__icon icon">
        <use xlink:href="#location"></use>
      </svg>
      ${location.name}, ${location.country}
    </span>
  `;

  const weatherInfoBottomHTML = `
    ${createWeatherIcon('weather-info__icon', current.condition.code)}
    <span class="weather-info__temp">${Math.round(current.temp_c)} °C</span>
    <span class="weather-info__condition">${current.condition.text}</span>
  `;
  weatherInfoElem.querySelector('.weather-info__top').innerHTML = weatherInfoTopHTML;
  weatherInfoElem.querySelector('.weather-info__bottom').innerHTML =
    weatherInfoBottomHTML;
};

const createForecast = (forecast) => {
  const liElem = document.createElement('li');
  liElem.className = 'forecast-daily__item';
  const forecastItemHTML = `
      ${createWeatherIcon('forecast-daily__icon', forecast.day.condition.code)}
      <span class="forecast-daily__day">${getWeekdayByDate(forecast.date)}</span>
      <span class="forecast-daily__temp">${Math.round(forecast.day.maxtemp_c)} °C</span>
  `;
  liElem.innerHTML = forecastItemHTML;

  forecastDailyList.appendChild(liElem);
};

const updateForecastUI = ({ forecastday }) => {
  const precipitation = forecastday[0].day.daily_chance_of_rain;
  const avgHumidity = forecastday[0].day.avghumidity;
  const maxWind = Math.round(forecastday[0].day.maxwind_kph);

  const forecastInfoHTML = `
    <p class="forecast__precipitation">Precipitation<span>${precipitation} %</span></p>
    <p class="forecast__humidity">Humidity<span>${avgHumidity}%</span></p>
    <p class="forecast__wind">Wind<span>${maxWind} km/h</span></p>
  `;
  forecastInfoElem.innerHTML = '';
  forecastInfoElem.innerHTML = forecastInfoHTML;

  forecastDailyList.innerHTML = '';
  for (let i = 1; i < forecastday.length; i++) {
    createForecast(forecastday[i], i);
  }
};

const initializeWeatherData = async (location) => {
  try {
    const data = await getForecastByLocation(location);
    updateCurrentWeatherUI(data);
    updateForecastUI(data.forecast);
  } catch (err) {
    alert(err.message);
  }
};

forecastLocationForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const inputValue = forecastLocationInput.value;
  if (inputValue.trim().length === 0) {
    alert("Location name can't be empty");
    return;
  }

  initializeWeatherData(inputValue);

  localStorage.setItem('location', inputValue);

  forecastLocationForm.reset();
});

// Upload persisted location
const persistedLocation = localStorage.getItem('location') || 'Kyiv';
initializeWeatherData(persistedLocation);
