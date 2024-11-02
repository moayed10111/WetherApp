# Weather App 🌤️

A simple weather app that provides real-time weather information for cities, including a 5-day forecast. This app fetches data from a weather API and allows users to track weather in multiple locations. It also saves a history of searched cities in a local JSON file.

## Features

- Get current weather details (temperature, wind speed, humidity, etc.) for any city.
- View a 5-day weather forecast.
- Store and manage a history of previously searched cities.
- Lightweight, modular architecture using TypeScript and Node.js.

## Technologies Used

- **Node.js** and **TypeScript** for backend services.
- **node-fetch** for making HTTP requests.
- **dotenv** for environment variable management.
- **UUID** for generating unique city identifiers.
- **fs/promises** for file system operations.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (v14+)
- [npm](https://www.npmjs.com/get-npm) (v6+)

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:moayed10111/WetherApp.git
   cd WeatherApp

2. Install dependencies:
    ```bash
    npm install

3. Create a .env file at the root of the project:
    ```bash
    API_BASE_URL=<YOUR_WEATHER_API_BASE_URL>
    API_KEY=<YOUR_API_KEY>

4. Set up the database:
- Create a folder db in the root of the project.
- Inside db, create an empty JSON file named db.json for storing city data
    ```bash
    mkdir db && echo "[]" > db/db.json

## Contributing

    We welcome contributions! Please follow these steps:

    1. Fork the repository.
    2. Create a new branch (`git checkout -b feature/YourFeature`).
    3. Commit your changes (`git commit -m 'Add some feature'`).
    4. Push to the branch (`git push origin feature/YourFeature`).
    5. Open a pull request.


## License
  This project it licensed under [MIT](https://opensource.org/licenses/MIT).


## Questions
If you have any questions or would like to git in touch, please feel free to contact
me via email or visit my GitHub profile.

-Email: moayed10111@gmail.com

-GitHub: https://github.com/moayed10111

-Website: https://wetherapp-p16p.onrender.com