const localServer = "http://localhost:53838/api/"
const remoteServer = "https://climainfo.bsite.net/api/"

const env = remoteServer

// Users API
const dataUser = env + "Users/" // Method GET
const registerUser = env + "Users" // Method POST
const loginUser = env + "Users/login" // Method POST
const updateUser = env + "Users/" // Method PUT

// Suggestions API
const allSuggestions = env + "Suggestions" // Method GET
const byAqiSuggestions = env + "Suggestions/WStatus/" // Method GET
const getSpecificSuggestion = env + "Suggestions/" // Method GET
const addSuggestion = env + "Suggestions" // Method POST
const deleteSuggestion = env + "Suggestions/" // Method DELETE
const updateSuggestion = env + "Suggestions/" // Method PUT

// Weather API
const geocodingWeather = env + "geocoding" // + {lat}/{lon}
const currentWeatherAirPollutionData = env + "airquality" // + {lat}/{lon}

const apiKey = "bbb366d2d2d593fd4c87ec503493363c" // API Key
const getWeatherData = "https://api.openweathermap.org/data/2.5/" // Method GET
const getWeatherDataByHttp = "http://api.openweathermap.org/data/2.5/" // Method GET
const getGeocodingDataByHttp = "http://api.openweathermap.org/geo/1.0/" // Method GET