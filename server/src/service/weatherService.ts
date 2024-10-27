import fetch from 'node-fetch';
import dotenv from 'dotenv';
import historyService from './historyService.js';
dotenv.config();

interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

class Weather {
  constructor(
    public city: string,
    public date: string,
    public icon: string,
    public iconDescription: string,
    public tempF: string,
    public windSpeed: string,
    public humidity: string
  ) {}
}

class WeatherService {
  private readonly baseURL = process.env.API_BASE_URL!;
  private readonly apiKey = process.env.API_KEY!;
  private city = '';

  // Convert UNIX timestamp to formatted date string
  private formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toISOString().split('T')[0];
  }

  // Fetch JSON data from a given API URL
  private async fetchData(query: string): Promise<any> {
    const response = await fetch(query);
    return response.json();
  }

  // Generate a query URL with specified path and parameters
  private createQueryURL(path: string, params: Record<string, string | number>): string {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = value.toString();
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    return `${this.baseURL}${path}?${queryString}&appid=${this.apiKey}`;
  }

  // Generate geolocation query URL for the city
  private createGeolocationQuery(): string {
    return this.createQueryURL('/geo/1.0/direct', { q: `${this.city},US` });
  }

  // Create URLs for current weather and forecast based on coordinates
  private createWeatherQueries({ lat, lon }: Coordinates): Record<string, string> {
    const params = { lat, lon, units: 'imperial' };
    return {
      current: this.createQueryURL('/data/2.5/weather', params),
      forecast: this.createQueryURL('/data/2.5/forecast', params),
    };
  }

  // Fetch location coordinates for the city
  private async getLocationData(): Promise<Coordinates> {
    const data: Coordinates[] = await this.fetchData(this.createGeolocationQuery());
    return data[0] || ({} as Coordinates);
  }

  // Fetch current and forecast weather data for the given coordinates
  private async getWeatherData(coords: Coordinates): Promise<{ current: any; forecast: any }> {
    const { current, forecast } = this.createWeatherQueries(coords);
    const [currentData, forecastData] = await Promise.all([
      this.fetchData(current),
      this.fetchData(forecast),
    ]);
    return { current: currentData, forecast: forecastData };
  }

  // Convert raw API response into a Weather object
  private mapToWeather(data: any): Weather {
    return new Weather(
      this.city,
      this.formatDate(data.dt),
      data.weather[0].icon,
      data.weather[0].description,
      data.main.temp,
      data.wind.speed,
      data.main.humidity
    );
  }

  // Generate an array of Weather objects for the forecast, excluding current date
  private generateForecastArray(forecastList: any[], currentWeather: Weather): Weather[] {
    const forecast: Weather[] = [];

    for (const item of forecastList) {
      const weatherDate = item.dt_txt.split(' ')[0];
      if (weatherDate === currentWeather.date || forecast.some(f => f.date === weatherDate)) continue;

      forecast.push(this.mapToWeather(item));
      if (forecast.length >= 5) break;
    }

    return forecast;
  }

  // Fetch and return weather and forecast for the specified city
  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.city = city;
    const location = await this.getLocationData();

    if (!Object.keys(location).length) {
      return [new Weather('City not found', '', '', '', '', '', '')];
    }

    const { current, forecast } = await this.getWeatherData(location);
    const currentWeather = this.mapToWeather(current);
    const forecastArray = this.generateForecastArray(forecast.list, currentWeather);

    await historyService.addCityIfNotExists(city);

    return [currentWeather, ...forecastArray];
  }
}

export default new WeatherService();
