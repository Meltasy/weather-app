const locationBtn = document.querySelector('#locationBtn')
const locationSearch = document.querySelector('#locationSearch')
const form = document.querySelector('form')

locationBtn.addEventListener('click', (event) => {
  event.preventDefault()
  const location = locationSearch.value.toLowerCase()
  getWeatherFortnight(location)
  getHourlyWeather(location)
  form.reset()
})

// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date1]/[date2]?key=YOUR_API_KEY
// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=2NAYMJYFN8NULALDR9TTEXV57&include=days&elements=tempmax,tempmin,temp,icon
// Location needs to be [town/city, country]

async function getWeatherFortnight(location) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=2NAYMJYFN8NULALDR9TTEXV57`, {mode: 'cors'})
    const weatherData = await response.json()
    console.log(weatherData)
    if (!response.ok) {
        console.log('Network response failed.')
      }
    showTodaysWeather(weatherData)
  } catch(error) {
    console.log(error.message)
  }
}

function showTodaysWeather(weatherData) {
  const todaysWeatherDisplay = document.querySelector('#todaysWeatherDisplay')
  while (todaysWeatherDisplay.hasChildNodes()) {
    todaysWeatherDisplay.removeChild(todaysWeatherDisplay.lastChild)
  }
  
  const locDateDisplay = document.createElement('div')
  const locationDisplay = document.createElement('h2')
  const location = weatherData.address.charAt(0).toUpperCase() + weatherData.address.slice(1)
  locationDisplay.textContent = `${location}`
  locDateDisplay.appendChild(locationDisplay)

  const dateDisplay = document.createElement('h3')
  const newDate = new Date(weatherData.days[0].datetime)
  const dateString = newDate.toDateString().slice(0, -5)
  dateDisplay.textContent = `${dateString}`
  locDateDisplay.appendChild(dateDisplay)  
  todaysWeatherDisplay.appendChild(locDateDisplay)

  const iconDisplay = document.createElement('img')
  const imageIcon = weatherData.days[0].icon
  iconDisplay.setAttribute('alt', `${imageIcon}`)
  iconDisplay.src = `./images/${imageIcon}.svg`
  todaysWeatherDisplay.appendChild(iconDisplay)

  const tempHumDisplay = document.createElement('div')
  const tempDisplay = document.createElement('h1')
  tempDisplay.textContent = `${weatherData.days[0].temp}\u00B0C`
  tempHumDisplay.appendChild(tempDisplay)

  const humidityDisplay = document.createElement('p')
  humidityDisplay.textContent = `Humidity: ${weatherData.days[0].humidity}%`
  tempHumDisplay.appendChild(humidityDisplay)  
  todaysWeatherDisplay.appendChild(tempHumDisplay)
}

async function getHourlyWeather(location) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today/tomorrow?unitGroup=metric&key=2NAYMJYFN8NULALDR9TTEXV57`, {mode: 'cors'})
    const hourlyData = await response.json()
    console.log(hourlyData)
    if (!response.ok) {
      console.log('Network response failed.')
    }
    showHourlyWeather(hourlyData)
  } catch(error) {
    console.log(error.message)
  }
}

function showHourlyWeather(hourlyData) {
  const weatherDisplay = document.querySelector('#weatherDisplay')
  while (weatherDisplay.hasChildNodes()) {
    weatherDisplay.removeChild(weatherDisplay.lastChild)
  }
  for (d = 0; d < hourlyData.days.length; d++) {
    const hourNow = new Date().getHours()
    let num = hourNow
    let length = hourlyData.days[0].hours.length
    if (d == 1) {
      num = 0
      length = hourNow
    }
    for (h = num; h < length; h++) {
      const hourlyDisplay = document.createElement('div')
      
      const hourlyText = document.createElement('h4')
      hourlyText.textContent = `${h}h`
      hourlyDisplay.appendChild(hourlyText)
    
      const iconDisplay = document.createElement('img')
      const imageIcon = hourlyData.days[d].hours[h].icon
      iconDisplay.setAttribute('alt', `${imageIcon}`)
      iconDisplay.src = `./images/${imageIcon}.svg`
      hourlyDisplay.appendChild(iconDisplay)
      
      const tempDisplay = document.createElement('h4')
      tempDisplay.textContent = `${hourlyData.days[d].hours[h].temp}\u00B0C`
      hourlyDisplay.appendChild(tempDisplay)
      
      const humidityDisplay = document.createElement('p')
      humidityDisplay.textContent = `H: ${hourlyData.days[d].hours[h].humidity}%`
      hourlyDisplay.appendChild(humidityDisplay)
    
      weatherDisplay.appendChild(hourlyDisplay)
    }
  }
}

getWeatherFortnight('hendaye')
getHourlyWeather('hendaye')
