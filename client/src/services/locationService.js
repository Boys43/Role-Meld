// Improved Location service using REST Countries API and static city data

class LocationService {
  constructor() {
    this.countries = [];
    this.cities = {};
    this.countryCityData = null;
  }

  // Fetch all countries using REST Countries API (more reliable)
  async getCountries() {
    try {
      if (this.countries.length > 0) {
        return this.countries;
      }

      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3');

      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }

      const data = await response.json();

      this.countries = data.map(country => ({
        name: country.name.common,
        iso2: country.cca2,
        iso3: country.cca3
      })).sort((a, b) => a.name.localeCompare(b.name));

      return this.countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      // Fallback to basic country list
      return this.getFallbackCountries();
    }
  }

  // Fallback country list in case API fails
  getFallbackCountries() {
    const fallbackCountries = [
      { name: 'United States', iso2: 'US', iso3: 'USA' },
      { name: 'United Kingdom', iso2: 'GB', iso3: 'GBR' },
      { name: 'Canada', iso2: 'CA', iso3: 'CAN' },
      { name: 'Australia', iso2: 'AU', iso3: 'AUS' },
      { name: 'Germany', iso2: 'DE', iso3: 'DEU' },
      { name: 'France', iso2: 'FR', iso3: 'FRA' },
      { name: 'India', iso2: 'IN', iso3: 'IND' },
      { name: 'Pakistan', iso2: 'PK', iso3: 'PAK' },
      { name: 'United Arab Emirates', iso2: 'AE', iso3: 'ARE' },
      { name: 'Saudi Arabia', iso2: 'SA', iso3: 'SAU' },
      { name: 'Qatar', iso2: 'QA', iso3: 'QAT' },
      { name: 'Oman', iso2: 'OM', iso3: 'OMN' },
      { name: 'Kuwait', iso2: 'KW', iso3: 'KWT' },
      { name: 'Bahrain', iso2: 'BH', iso3: 'BHR' },
      { name: 'China', iso2: 'CN', iso3: 'CHN' },
      { name: 'Japan', iso2: 'JP', iso3: 'JPN' },
      { name: 'Singapore', iso2: 'SG', iso3: 'SGP' },
      { name: 'Malaysia', iso2: 'MY', iso3: 'MYS' },
      { name: 'Bangladesh', iso2: 'BD', iso3: 'BGD' },
      { name: 'Sri Lanka', iso2: 'LK', iso3: 'LKA' },
    ].sort((a, b) => a.name.localeCompare(b.name));

    this.countries = fallbackCountries;
    return fallbackCountries;
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

      // Try primary API
      try {
        const response = await fetch(`https://countriesnow.space/api/v0.1/countries/cities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            country: countryName
          })
        });

        const data = await response.json();

        if (!data.error && data.data && data.data.length > 0) {
          const cities = data.data.sort((a, b) => a.localeCompare(b));
          this.cities[countryName] = cities;
          return cities;
        }
      } catch (apiError) {
        console.warn('Primary cities API failed, using fallback');
      }

      // Fallback to static city data
      const fallbackCities = this.getFallbackCities(countryName);
      this.cities[countryName] = fallbackCities;
      return fallbackCities;

    } catch (error) {
      console.error('Error fetching cities:', error);
      // Return fallback cities
      return this.getFallbackCities(countryName);
    }
  }

  // Fallback cities for major countries
  getFallbackCities(countryName) {
    const cityData = {
      'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston', 'Washington'],
      'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Cardiff', 'Belfast', 'Leicester', 'Nottingham', 'Newcastle', 'Brighton', 'Southampton', 'Portsmouth', 'Reading', 'Oxford', 'Cambridge'],
      'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener', 'London', 'Victoria', 'Halifax', 'Oshawa', 'Windsor', 'Saskatoon', 'Regina', 'St. John\'s', 'Kelowna', 'Barrie'],
      'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Wollongong', 'Logan City', 'Geelong', 'Hobart', 'Townsville', 'Cairns', 'Darwin', 'Toowoomba', 'Ballarat', 'Bendigo', 'Albury', 'Launceston'],
      'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi'],
      'Pakistan': ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Hyderabad', 'Gujranwala', 'Peshawar', 'Quetta', 'Islamabad', 'Sargodha', 'Sialkot', 'Bahawalpur', 'Sukkur', 'Jhang', 'Sheikhupura', 'Larkana', 'Gujrat', 'Mardan', 'Kasur'],
      'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Khor Fakkan', 'Dibba Al-Fujairah', 'Dibba Al-Hisn', 'Jebel Ali', 'Madinat Zayed', 'Ruwais', 'Liwa Oasis'],
      'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk', 'Buraidah', 'Khamis Mushait', 'Hofuf', 'Taif', 'Najran', 'Jubail', 'Abha', 'Yanbu', 'Al Qatif', 'Arar', 'Sakaka', 'Jizan', 'Dhahran'],
      'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hanover', 'Nuremberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster'],
      'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne'],
      'China': ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Tianjin', 'Wuhan', 'Dongguan', 'Chongqing', 'Nanjing', 'Shenyang', 'Hangzhou', 'Xi\'an', 'Harbin', 'Suzhou', 'Qingdao', 'Dalian', 'Zhengzhou', 'Shantou', 'Jinan'],
      'Japan': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama', 'Hiroshima', 'Sendai', 'Kitakyushu', 'Chiba', 'Sakai', 'Niigata', 'Hamamatsu', 'Kumamoto', 'Sagamihara', 'Shizuoka'],
      'Singapore': ['Singapore', 'Jurong East', 'Woodlands', 'Tampines', 'Bedok', 'Sengkang', 'Hougang', 'Yishun', 'Choa Chu Kang', 'Punggol'],
      'Malaysia': ['Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Johor Bahru', 'Malacca City', 'Alor Setar', 'Seremban', 'Kuching', 'Kota Kinabalu', 'Kuantan', 'Kota Bharu', 'Kuala Terengganu', 'Sandakan', 'Tawau', 'Miri', 'Sibu', 'Klang', 'Subang Jaya'],
      'Bangladesh': ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Barisal', 'Rangpur', 'Comilla', 'Gazipur', 'Narayanganj', 'Mymensingh', 'Jessore', 'Cox\'s Bazar', 'Bogra', 'Dinajpur', 'Pabna', 'Tangail', 'Jamalpur', 'Faridpur', 'Brahmanbaria'],
      'Qatar': ['Doha', 'Al Rayyan', 'Umm Salal', 'Al Wakrah', 'Al Khor', 'Mesaieed', 'Dukhan', 'Al Shamal', 'Al Shahaniya', 'Madinat ash Shamal'],
      'Oman': ['Muscat', 'Salalah', 'Sohar', 'Nizwa', 'Sur', 'Ibri', 'Barka', 'Rustaq', 'Al Buraimi', 'Khasab'],
      'Kuwait': ['Kuwait City', 'Hawalli', 'Salmiya', 'Sabah Al Salem', 'Al Ahmadi', 'Al Farwaniyah', 'Al Jahra', 'Fahaheel', 'Mangaf', 'Abu Halifa'],
      'Bahrain': ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'A\'ali', 'Isa Town', 'Sitra', 'Budaiya', 'Jidhafs', 'Al-Malikiyah'],
      'Sri Lanka': ['Colombo', 'Dehiwala-Mount Lavinia', 'Moratuwa', 'Negombo', 'Kandy', 'Kalmunai', 'Galle', 'Trincomalee', 'Batticaloa', 'Jaffna'],
    };

    return cityData[countryName] || ['Capital City', 'Major City 1', 'Major City 2'];
  }

  // Search cities within a country
  searchCities(cities, query) {
    if (!query) return cities;

    return cities.filter(city =>
      city.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default new LocationService();
