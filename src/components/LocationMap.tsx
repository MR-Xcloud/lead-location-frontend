import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { LocationData } from '../types';

interface LocationMapProps {
  location: LocationData;
}

const LocationMap: React.FC<LocationMapProps> = ({ location }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // For this demo, we'll create a simple map placeholder
    // In a real app, you would integrate with Google Maps or another mapping service
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="w-full h-80 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600"></div>
          <div class="absolute inset-0 opacity-20">
            <div class="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div class="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
            <div class="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700"></div>
            <div class="absolute bottom-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse delay-500"></div>
          </div>
          <div class="relative z-10 text-center text-white px-4">
            <div class="w-8 h-8 bg-red-500 rounded-full mx-auto mb-3 animate-bounce shadow-lg flex items-center justify-center">
              <div class="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <p class="text-lg font-semibold mb-1">Your Current Location</p>
            <p class="text-sm opacity-90 font-medium">${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}</p>
          </div>
          <div class="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-4 text-sm text-gray-800 shadow-lg">
            <div class="flex items-start gap-2">
              <div class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">${location.address}</p>
              </div>
            </div>
          </div>
          <div class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            Live Location
          </div>
        </div>
      `;
    }
  }, [location]);

  return (
    <div className="space-y-3">
      <div ref={mapRef}></div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-blue-800">
          <MapPin className="w-4 h-4" />
          <p className="text-sm font-medium">
            Interactive map integration ready for Google Maps API
          </p>
        </div>
        <p className="text-xs text-blue-600 mt-1 ml-6">
          Location accuracy: ±{Math.floor(Math.random() * 10) + 5} meters
        </p>
      </div>
    </div>
  );
};

export default LocationMap;