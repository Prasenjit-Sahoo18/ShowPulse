import React, { useState } from 'react';
import { useCity } from '../../context/CityContext.js';
import { Modal } from './Modal.js';
import { MapPin, Search, Check, Sparkles } from 'lucide-react';

export const CityModal: React.FC = () => {
  const { cities, selectedCity, setSelectedCity, isCityModalOpen, closeCityModal } = useCity();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isCityModalOpen} onClose={closeCityModal} title="Select Your City" maxWidth="lg">
      <div className="space-y-4">
        {/* City Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search for your city or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Popular Cities */}
        {!searchTerm && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Popular Cities</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {cities
                .filter((c) => c.isPopular)
                .map((city) => {
                  const isSelected = selectedCity === city.slug;
                  return (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCity(city.slug)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-violet-600/20 border-violet-500 text-violet-300 ring-1 ring-violet-500 shadow-md shadow-violet-600/20'
                          : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      <MapPin className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-violet-400' : 'text-slate-400'}`} />
                      <span className="text-sm font-semibold truncate w-full">{city.name}</span>
                      <span className="text-[11px] text-slate-400 truncate w-full">{city.state}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* All / Filtered Cities */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {searchTerm ? 'Search Results' : 'All Supported Cities'}
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
            {filteredCities.map((city) => {
              const isSelected = selectedCity === city.slug;
              return (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.slug)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-colors ${
                    isSelected
                      ? 'bg-violet-600/15 text-violet-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{city.name}</span>
                    <span className="text-xs text-slate-500">({city.state})</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-violet-400" />}
                </button>
              );
            })}
            {filteredCities.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-sm">
                No cities found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
