import React, { useState } from 'react';
import LocationSelector from './LocationSelector';

const LocationExample = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Location Selector Example</h2>
      
      <LocationSelector
        selectedCountry={selectedCountry}
        selectedCity={selectedCity}
        onCountryChange={setSelectedCountry}
        onCityChange={setSelectedCity}
      />
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Selected Location:</h3>
        <p><strong>Country:</strong> {selectedCountry || 'None selected'}</p>
        <p><strong>City:</strong> {selectedCity || 'None selected'}</p>
      </div>
    </div>
  );
};

export default LocationExample;
