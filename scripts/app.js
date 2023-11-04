const API_KEY = '0fe8f75e23d447e8a0b122151232910';

const weatherInfoElem = document.querySelector('.weather-info');
const forecastElem = document.querySelector('.forecast');
const forecastDailyElem = document.querySelector('.forecast-daily');
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

const getForecastByLocation = async (location) => {
  try {
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=4&aqi=no&alerts=no`;

    const res = await fetch(API_URL);
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

const createWeatherIcon = (code) => {
  let iconName = 'sun';

  if ((code >= 1003 && code <= 1030) || code === 1135 || code === 1147) {
    iconName = 'cloud-sun';
  }
  if ((code >= 1063 && code <= 1117) || code >= 1150) {
    iconName = 'cloud-rain';
  }

  const iconHTML = `
    <svg class="weather-info__icon icon">
      <use xlink:href="#${iconName}"></use>
    </svg>
  `;

  return iconHTML;
};

const updateCurrentWeatherUI = ({ current, location }) => {
  const weatherInfoTopElem = weatherInfoElem.querySelector('.weather-info__top');
  const weatherInfoBottomElem = weatherInfoElem.querySelector('.weather-info__bottom');

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
    ${createWeatherIcon(current.condition.code)}
    <span class="weather-info__temp">${Math.round(current.temp_c)} °C</span>
    <span class="weather-info__condition">${current.condition.text}</span>
  `;

  weatherInfoTopElem.innerHTML = weatherInfoTopHTML;
  weatherInfoBottomElem.innerHTML = weatherInfoBottomHTML;
};

const updateForecastUI = (forecastData) => {};

// Initial location
getForecastByLocation('Kyiv').then((data) => {
  updateCurrentWeatherUI(data);
});

forecastLocationForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const inputValue = forecastLocationInput.value;
  if (inputValue.trim().length === 0) {
    alert("Location name can't be empty");
    return;
  }

  getForecastByLocation(inputValue).then((data) => {
    updateCurrentWeatherUI(data);
  });

  forecastLocationForm.reset();
});
