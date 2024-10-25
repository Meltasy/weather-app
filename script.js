const locationBtn = document.querySelector('#locationBtn')
const locationSearch = document.querySelector('#locationSearch')
const form = document.querySelector('form')
const hourlyBtn = document.querySelector('#hourlyBtn')
const hourlyDisplay = document.querySelector('#hourlyDisplay')
const weeklyBtn = document.querySelector('#weeklyBtn')
const weeklyDisplay = document.querySelector('#weeklyDisplay')
const fortnightBtn = document.querySelector('#fortnightBtn')
const fortnightDisplay = document.querySelector('#fortnightDisplay')

window.onload = () => {
  getTodaysWeather('paris')
  getHourlyWeather('paris')
  getWeeklyWeather('paris')
  getFortnightWeather('paris')
  hourlyDisplay.style.display = 'grid'
  weeklyDisplay.style.display = 'none'
  fortnightDisplay.style.display = 'none'
}

locationBtn.addEventListener('click', (event) => {
  event.preventDefault()
  const location = locationSearch.value.toLowerCase()
  getTodaysWeather(location)
  getHourlyWeather(location)
  getWeeklyWeather(location)
  getFortnightWeather(location)
  form.reset()
})

hourlyBtn.addEventListener('click', () => {
  hourlyDisplay.style.display = 'grid'
  weeklyDisplay.style.display = 'none'
  fortnightDisplay.style.display = 'none'
})

weeklyBtn.addEventListener('click', () => {
  hourlyDisplay.style.display = 'none'
  weeklyDisplay.style.display = 'grid'
  fortnightDisplay.style.display = 'none'
})

fortnightBtn.addEventListener('click', () => {
  hourlyDisplay.style.display = 'none'
  weeklyDisplay.style.display = 'none'
  fortnightDisplay.style.display = 'grid'
})

function getTodaysWeather(location) {
  fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?unitGroup=metric&key=2NAYMJYFN8NULALDR9TTEXV57`, {mode: 'cors'})
  .then(response => {
    if (!response.ok) {
        console.log('Network response failed.')
    }
    return response.json()
  })
  .then(response => {
    const todaysData = response
    showTodaysWeather(todaysData)
    console.log(todaysData)
  })
  .catch(error => {
    console.log(error.message)
  })
}

function showTodaysWeather(todaysData) {
  const todaysWeatherDisplay = document.querySelector('#todaysWeatherDisplay')
  while (todaysWeatherDisplay.hasChildNodes()) {
    todaysWeatherDisplay.removeChild(todaysWeatherDisplay.lastChild)
  }
  
  const locDateDisplay = document.createElement('div')
  const locationDisplay = document.createElement('h2')
  locationDisplay.setAttribute('id', 'currentLocation')
  const location = todaysData.address.charAt(0).toUpperCase() + todaysData.address.slice(1)
  locationDisplay.textContent = `${location}`
  locDateDisplay.appendChild(locationDisplay)

  const dateDisplay = document.createElement('h3')
  const newDate = new Date(todaysData.days[0].datetime)
  const dateString = newDate.toDateString().slice(0, -5)
  dateDisplay.textContent = `${dateString}`
  locDateDisplay.appendChild(dateDisplay)  
  todaysWeatherDisplay.appendChild(locDateDisplay)

  const iconDisplay = document.createElement('img')
  const imageIcon = todaysData.days[0].icon
  iconDisplay.setAttribute('alt', `${imageIcon}`)
  iconDisplay.src = `./images/${imageIcon}.svg`
  todaysWeatherDisplay.appendChild(iconDisplay)

  const tempHumDisplay = document.createElement('div')
  const tempDisplay = document.createElement('h1')
  tempDisplay.textContent = `${todaysData.days[0].temp}\u00B0C`
  tempHumDisplay.appendChild(tempDisplay)

  const humidityDisplay = document.createElement('p')
  humidityDisplay.textContent = `Humidity: ${todaysData.days[0].humidity}%`
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
  while (hourlyDisplay.hasChildNodes()) {
    hourlyDisplay.removeChild(hourlyDisplay.lastChild)
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
      const hourlyContainer = document.createElement('div')
      
      const hourlyText = document.createElement('h4')
      hourlyText.textContent = `${h}h`
      hourlyContainer.appendChild(hourlyText)
    
      const iconDisplay = document.createElement('img')
      const imageIcon = hourlyData.days[d].hours[h].icon
      iconDisplay.setAttribute('alt', `${imageIcon}`)
      iconDisplay.src = `./images/${imageIcon}.svg`
      hourlyContainer.appendChild(iconDisplay)
      
      const tempDisplay = document.createElement('h4')
      tempDisplay.textContent = `${hourlyData.days[d].hours[h].temp}\u00B0C`
      hourlyContainer.appendChild(tempDisplay)
      
      const humidityDisplay = document.createElement('p')
      humidityDisplay.textContent = `H: ${hourlyData.days[d].hours[h].humidity}%`
      hourlyContainer.appendChild(humidityDisplay)
    
      hourlyDisplay.appendChild(hourlyContainer)
    }
  }
}

function getWeeklyWeather(location) {
  fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?unitGroup=metric&key=2NAYMJYFN8NULALDR9TTEXV57`, {mode: 'cors'})
  .then(response => {
    if (!response.ok) {
        console.log('Network response failed.')
    }
    return response.json()
  })
  .then(response => {
    const weeklyData = response
    showWeeklyWeather(weeklyData)
    console.log(weeklyData)
  })
  .catch(error => {
    console.log(error.message)
  })
}

function showWeeklyWeather(weeklyData) {
  while (weeklyDisplay.hasChildNodes()) {
    weeklyDisplay.removeChild(weeklyDisplay.lastChild)
  }
  for (d = 0; d < weeklyData.days.length; d++) {
    const weeklyContainer = document.createElement('div')

    const dateDisplay = document.createElement('h4')
    const newDate = new Date(weeklyData.days[d].datetime)
    const dateString = newDate.toDateString().slice(4, -5)
    dateDisplay.textContent = `${dateString}`
    weeklyContainer.appendChild(dateDisplay)
    
    const iconDisplay = document.createElement('img')
    const imageIcon = weeklyData.days[d].icon
    iconDisplay.setAttribute('alt', `${imageIcon}`)
    iconDisplay.src = `./images/${imageIcon}.svg`
    weeklyContainer.appendChild(iconDisplay)
      
    const tempDisplay = document.createElement('h4')
    tempDisplay.textContent = `${weeklyData.days[d].temp}\u00B0C`
    weeklyContainer.appendChild(tempDisplay)
      
    const humidityDisplay = document.createElement('p')
    humidityDisplay.textContent = `H: ${weeklyData.days[d].humidity}%`
    weeklyContainer.appendChild(humidityDisplay)
    
    weeklyDisplay.appendChild(weeklyContainer)
  }
}

async function getFortnightWeather(location) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=2NAYMJYFN8NULALDR9TTEXV57`, {mode: 'cors'})
    const fortnightData = await response.json()
    console.log(fortnightData)
    if (!response.ok) {
        console.log('Network response failed.')
      }
    showFortnightWeather(fortnightData)
  } catch(error) {
    console.log(error.message)
  }
}

function showFortnightWeather(fortnightData) {
  while (fortnightDisplay.hasChildNodes()) {
    fortnightDisplay.removeChild(fortnightDisplay.lastChild)
  }
  for (d = 0; d < fortnightData.days.length; d++) {
    const fortnightContainer = document.createElement('div')

    const dateDisplay = document.createElement('h4')
    const newDate = new Date(fortnightData.days[d].datetime)
    const dateString = newDate.toDateString().slice(4, -5)
    dateDisplay.textContent = `${dateString}`
    fortnightContainer.appendChild(dateDisplay)
    
    const iconDisplay = document.createElement('img')
    const imageIcon = fortnightData.days[d].icon
    iconDisplay.setAttribute('alt', `${imageIcon}`)
    iconDisplay.src = `./images/${imageIcon}.svg`
    fortnightContainer.appendChild(iconDisplay)
      
    const tempDisplay = document.createElement('h4')
    tempDisplay.textContent = `${fortnightData.days[d].temp}\u00B0C`
    fortnightContainer.appendChild(tempDisplay)
      
    const humidityDisplay = document.createElement('p')
    humidityDisplay.textContent = `H: ${fortnightData.days[d].humidity}%`
    fortnightContainer.appendChild(humidityDisplay)
    
    fortnightDisplay.appendChild(fortnightContainer)
  }
}