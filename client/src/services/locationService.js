// Location service using free APIs for countries and cities

class LocationService {
  constructor() {
    this.baseURL = 'https://countriesnow.space/api/v0.1';
    this.countries = [];
    this.cities = {};
  }

  // Fetch all countries
  async getCountries() {
    try {
      if (this.countries.length > 0) {
        return this.countries;
      }

      const response = await fetch(`${this.baseURL}/countries`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.msg);
      }

      this.countries = data.data.map(country => ({
        name: country.country,
        iso2: country.iso2,
        iso3: country.iso3
      })).sort((a, b) => a.name.localeCompare(b.name));

      return this.countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  // Search countries by name
  searchCountries(query) {
    if (!query) return this.countries;
    
    return this.countries.filter(country =>
      country.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Fetch cities for a specific country
  async getCitiesForCountry(countryName) {
    try {
      // Check cache first
      if (this.cities[countryName]) {
        return this.cities[countryName];
      }

      const response = await fetch(`${this.baseURL}/countries/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: countryName
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.msg);
      }

      const cities = data.data.sort((a, b) => a.localeCompare(b));
      
      // Cache the result
      this.cities[countryName] = cities;
      
      return cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }

  // Search cities within a country
  searchCities(cities, query) {
    if (!query) return cities;
    
    return cities.filter(city =>
      city.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Alternative method using REST Countries API for countries
  async getCountriesAlternative() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3');
      const data = await response.json();
      
      return data.map(country => ({
        name: country.name.common,
        iso2: country.cca2,
        iso3: country.cca3
      })).sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching countries from REST Countries:', error);
      throw error;
    }
  }
}

export default new LocationService();
