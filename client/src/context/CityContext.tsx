import React, { createContext, useContext, useEffect, useState } from 'react';
import { City } from '../types/index.js';
import { cityApi } from '../services/api.js';

interface CityContextType {
  selectedCity: string;
  setSelectedCity: (citySlug: string) => void;
  selectedCityName: string;
  cities: City[];
  isCityModalOpen: boolean;
  openCityModal: () => void;
  closeCityModal: () => void;
  isLoading: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<string>(() => {
    return localStorage.getItem('cinepulse_selected_city') || 'bhubaneswar';
  });
  const [cities, setCities] = useState<City[]>([]);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await cityApi.getCities();
        setCities(data);
      } catch (err) {
        console.error('Failed to load cities', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, []);

  const setSelectedCity = (citySlug: string) => {
    setSelectedCityState(citySlug);
    localStorage.setItem('cinepulse_selected_city', citySlug);
    setIsCityModalOpen(false);
  };

  const currentCityObj = cities.find((c) => c.slug === selectedCity);
  const selectedCityName = currentCityObj?.name || 'Bhubaneswar';

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        selectedCityName,
        cities,
        isCityModalOpen,
        openCityModal: () => setIsCityModalOpen(true),
        closeCityModal: () => setIsCityModalOpen(false),
        isLoading,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity must be used within a CityProvider');
  return context;
};
