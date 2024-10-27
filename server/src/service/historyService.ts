import { readFile, writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
  constructor(public name: string, public id: string = uuidv4()) {}
}

class HistoryService {
  private readonly DB_PATH = `${process.cwd()}/db/db.json`;

  // Load the city data from the JSON file
  private async loadCities(): Promise<City[]> {
    try {
      const data = await readFile(this.DB_PATH, 'utf-8');
      return JSON.parse(data) || [];
    } catch (error) {
      console.error('Error reading cities from database:', error);
      return [];
    }
  }

  // Save the city data to the JSON file
  private async saveCities(cities: City[]): Promise<void> {
    try {
      await writeFile(this.DB_PATH, JSON.stringify(cities, null, 4), 'utf-8');
    } catch (error) {
      console.error('Error writing cities to database:', error);
    }
  }

  // Retrieve all cities from the database
  async getAllCities(): Promise<City[]> {
    return this.loadCities();
  }

  // Add a new city if it doesn't already exist in the database
  async addCityIfNotExists(name: string): Promise<void> {
    const cities = await this.loadCities();
    if (!cities.some(city => city.name === name)) {
      cities.push(new City(name));
      await this.saveCities(cities);
    }
  }

  // Remove a city by its ID
  async deleteCityById(id: string): Promise<void> {
    const cities = await this.loadCities();
    const filteredCities = cities.filter(city => city.id !== id);

    if (filteredCities.length !== cities.length) {
      await this.saveCities(filteredCities);
    }
  }
}

export default new HistoryService();
