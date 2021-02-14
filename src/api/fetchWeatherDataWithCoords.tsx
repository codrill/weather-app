import * as queryString from 'querystring';

const apiKey = '748a5ce04cac6544fea0f6dbc487247f'
const units = 'metric'

export type FetchWeatherParams = {
  lon?: string,
  lat?: string,
  q?: string
  appid: string,
  units: string
  exclude?: string
}

export type WeatherDataResponse = {
  weather: string
  weatherDescription: string
  temperature: number | undefined
  tempFeelsLike: number
  minTemperature: number
  maxTemperature: number
  pressure: number
  humidity: number
  windSpeed: number
  cloudsPercentage: number
  cityName: string
  sunrise: string
  sunset: string
  icon: string
  date: string
}

export const IntialWeatherDataResponse = [{
  weather: '',
  weatherDescription: '',
  temperature: 0,
  tempFeelsLike: 0,
  minTemperature: 0,
  maxTemperature: 0,
  pressure: 0,
  humidity: 0,
  windSpeed: 0,
  cloudsPercentage: 0,
  cityName: '',
  sunrise: '',
  sunset: '',
  icon: '',
  date: ''
}];

export const fetchWeatherDataWithCoords = (location: any) => {
  const prepareFetchParameters: FetchWeatherParams = {
    lon: location.longitude,
    lat: location.latitude,
    exclude: 'minutely, hourly, alerts',
    units: units,
    appid: apiKey
  };

  const parsedParameters = queryString.stringify(prepareFetchParameters);

  return fetch(`http://api.openweathermap.org/data/2.5/onecall?${parsedParameters}`)
    .then(result => result.json());
};

export const fetchWeatherDataWithUserDefinedCity = (userDefinedCity: string) => {
  const prepareFetchParameters: FetchWeatherParams = {
    q: userDefinedCity,
    appid: apiKey,
    units: units
  };

  const parsedParameters = queryString.stringify(prepareFetchParameters);

  return fetch(`https://api.openweathermap.org/data/2.5/weather?${parsedParameters}`)
    .then(result => result.json());
};

export const fetchWeatherDataWithUserDefinedCity7Days = () => {
  const prepareFetchParameters = {
    lat: '50.270908',
    lon: '19.039993',
    exclude: 'minutely, hourly, alerts',
    units: units,
    appid: apiKey
  };

  const parsedParameters = queryString.stringify(prepareFetchParameters);

  return fetch(`http://api.openweathermap.org/data/2.5/onecall?${parsedParameters}`)
    .then(result => result.json());
}
