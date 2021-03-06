import React, { useState } from 'react'
import {
  fetchMockGeocodingCoordinates,
  fetchMockWeatherDataWithUserDefinedCity,
  GeocodingLocation,
  InitialCurrentDataResponse,
  InitialWeatherDataResponse,
  WeatherDataResponse
} from '../../api/fetchWeatherDataWithCoords'

import * as moment from 'moment'
import Button from 'react-bootstrap/Button'
import './WeatherContainer.sass'
import { CurrentWeatherComponent } from '../../component/CurrentWeatherComponent/CurrentWeatherComponent'
import WeekWeatherComponent from '../../component/WeekWeatherComponent/WeekWeatherComponent'
import WeatherHighlightsContainer from 'container/WeatherHighlightsContainer/WeatherHighlightsContainer'

const userInputRegex = new RegExp('^[a-zA-Z]+$')

export const WeatherContainer: React.FC = () => {

  const [weatherData, setWeatherData] = useState<WeatherDataResponse[]>(InitialWeatherDataResponse)
  const [userDefinedCity, setUserDefinedCity] = useState<string>('Katowice')
  const [weatherDataReady, setWeatherDataReady] = useState<boolean>(false)
  const [currentWeatherData, setCurrentWeatherData] = useState<WeatherDataResponse>(InitialCurrentDataResponse)

  const convertUnixTimestampToDate = (timestamp: number, format = "DD MMM YYYY hh:mm a") => {
    return moment.unix(timestamp).format(format)
  }

  const prepareWeatherDataForRestDays = (response: any) => {
    const current = response.current

    const weatherForRestOfTheDays = response.daily.map((element: any) => {
      return {
        date: convertUnixTimestampToDate(element.dt, "dddd"),
        weather: element.weather[0].main,
        weatherDescription: element.weather[0].description,
        temperature: Math.round(element.temp.day),
        tempFeelsLike: element.feels_like.day,
        minTemperature: Math.round(element.temp.min),
        maxTemperature: Math.round(element.temp.max),
        pressure: element.pressure,
        humidity: element.humidity,windSpeed: element.wind_speed,
        windDeg: element.wind_deg,
        windGust: element.wind_gust,
        sunrise: convertUnixTimestampToDate(element.sunrise),
        sunset: convertUnixTimestampToDate(element.sunset),
        icon: element.weather[0].icon
      }
    })

    const currentWeather = {
      date: convertUnixTimestampToDate(current.dt, "dddd, hh:mm"),
      cityName: userDefinedCity,
      weather: current.weather[0].main,
      weatherDescription: current.weather[0].description,
      temperature: Math.round(current.temp),
      tempFeelsLike: current.feels_like.day,
      minTemperature: Math.round(current.temp.min),
      maxTemperature: Math.round(current.temp.max),
      pressure: current.pressure,
      humidity: current.humidity,
      visibility: current.visibility,
      uvi: current.uvi,
      windSpeed: current.wind_speed,
      windDeg: current.wind_deg,
      windGust: current.wind_gust,
      sunrise: convertUnixTimestampToDate(current.sunrise, 'HH:mm'),
      sunset: convertUnixTimestampToDate(current.sunset, 'HH:mm'),
      icon: current.weather[0].icon
    }

    setWeatherData(weatherForRestOfTheDays)
    setCurrentWeatherData(currentWeather)
  }

  const CityInput = () => {
    return (
      <div className="city-input">
        <input
          value={userDefinedCity}
          onChange={checkRegexExpression}
          placeholder="Your City"
        />
        <Button onClick={onButtonClick}>Send</Button>
      </div>)
  }

  const checkRegexExpression = (inputElement: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = inputElement.target.value

    if (!value) {
      setUserDefinedCity('')
    } else if (userInputRegex.test(value)) {
      setUserDefinedCity(value)
    }
  }

  const prepareGeolocationData = (geocodingResponse: any) => {
    return {
      latitude: geocodingResponse[0].lat,
      longitude: geocodingResponse[0].lon
    } as GeocodingLocation
  }

  const prepareAndSetWeatherInformation = () => {
    userDefinedCity && fetchMockGeocodingCoordinates()
      .then(result => {
        return prepareGeolocationData(result)
      })
      .then(result => {
        fetchMockWeatherDataWithUserDefinedCity()
          .then(response => {
            prepareWeatherDataForRestDays(response)
            setWeatherDataReady(true)
          })
      })
  }

  const onButtonClick = () => {
    prepareAndSetWeatherInformation()
  }

  return <div className="app-container">
    {CityInput()}

    {weatherDataReady &&
    <div className="weather-container">
      <CurrentWeatherComponent data={currentWeatherData}/>
      <div className="right-side">
        <WeekWeatherComponent data={weatherData}/>
        <WeatherHighlightsContainer data={currentWeatherData}/>
      </div>

    </div>
    }
  </div>
}

export default WeatherContainer
