import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, MapPin, X } from 'lucide-react';
import locationService from '../services/locationService';

const LocationSelector = ({
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange,
  disabled = false
}) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryQuery, setCountryQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  const countryRef = useRef(null);
  const cityRef = useRef(null);

  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Load cities when country changes
  useEffect(() => {
    if (selectedCountry) {
      loadCities(selectedCountry);
    } else {
      setCities([]);
      onCityChange('');
    }
  }, [selectedCountry]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const countriesData = await locationService.getCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error('Failed to load countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async (countryName) => {
    try {
      setCityLoading(true);
      const citiesData = await locationService.getCitiesForCountry(countryName);
      setCities(citiesData);
    } catch (error) {
      console.error('Failed to load cities:', error);
      setCities([]);
    } finally {
      setCityLoading(false);
    }
  };

  const filteredCountries = countries.length > 0
    ? locationService.searchCountries(countryQuery).slice(0, 10)
    : [];
  const filteredCities = cities.length > 0
    ? locationService.searchCities(cities, cityQuery).slice(0, 10)
    : [];

  console.log(filteredCountries);
  console.log(filteredCities);

  const handleCountrySelect = (country) => {
    onCountryChange(country.name);
    setCountryQuery('');
    setShowCountryDropdown(false);
    onCityChange(''); // Reset city when country changes
  };

  const handleCitySelect = (city) => {
    onCityChange(city);
    setCityQuery('');
    setShowCityDropdown(false);
  };

  const clearCountry = () => {
    onCountryChange('');
    setCountryQuery('');
    onCityChange('');
  };

  const clearCity = () => {
    onCityChange('');
    setCityQuery('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Country Selector */}
      <div className="space-y-2" ref={countryRef}>
        <label className="flex items-center gap-2 font-medium text-gray-700">
          <MapPin className="w-4 h-4 text-gray-500" />
          Country
        </label>
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              value={selectedCountry || countryQuery}
              onChange={(e) => {
                setCountryQuery(e.target.value);
                setShowCountryDropdown(true);
                if (!e.target.value) {
                  clearCountry();
                }
              }}
              onFocus={() => setShowCountryDropdown(true)}
              placeholder="Search for a country..."
              disabled={disabled || loading}
              className="w-full p-3 pr-20 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {selectedCountry && (
                <button
                  onClick={clearCountry}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {showCountryDropdown && (
            <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading countries...</div>
              ) : filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <div
                    key={country.iso2}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full text-left p-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{country.name}</span>
                      <span className="text-xs text-gray-500">{country.iso2}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  {countryQuery ? 'No countries found' : 'Start typing to search countries'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* City Selector */}
      <div className="space-y-2" ref={cityRef}>
        <label className="flex items-center gap-2 font-medium text-gray-700">
          <MapPin className="w-4 h-4 text-gray-500" />
          City
        </label>
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              value={selectedCity || cityQuery}
              onChange={(e) => {
                setCityQuery(e.target.value);
                setShowCityDropdown(true);
                if (!e.target.value) {
                  clearCity();
                }
              }}
              onFocus={() => selectedCountry && setShowCityDropdown(true)}
              placeholder={selectedCountry ? "Search for a city..." : "Select a country first"}
              disabled={disabled || !selectedCountry || cityLoading}
              className="w-full p-3 pr-20 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors disabled:bg-gray-100"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {selectedCity && (
                <button
                  onClick={clearCity}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {showCityDropdown && selectedCountry && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {cityLoading ? (
                <div className="p-3 text-center text-gray-500">Loading cities...</div>
              ) : filteredCities.length > 0 ? (
                filteredCities.map((city, index) => (
                  <div
                    key={index}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left p-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                    type="button"
                  >
                    {city}
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  {cityQuery ? 'No cities found' : cities.length === 0 ? 'No cities available' : 'Start typing to search cities'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
