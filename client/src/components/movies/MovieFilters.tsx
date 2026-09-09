import React from 'react';

interface MovieFiltersProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  selectedFormat: string;
  onFormatChange: (fmt: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const GENRES = [
  { label: 'All Genres', value: '' },
  { label: 'Action', value: 'action' },
  { label: 'Sci-Fi', value: 'sci-fi' },
  { label: 'Thriller', value: 'thriller' },
  { label: 'Drama', value: 'drama' },
  { label: 'Comedy', value: 'comedy' },
  { label: 'Romance', value: 'romance' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Fantasy', value: 'fantasy' },
  { label: 'Horror', value: 'horror' },
];

const LANGUAGES = [
  { label: 'All Languages', value: '' },
  { label: 'English', value: 'English' },
  { label: 'Hindi', value: 'Hindi' },
  { label: 'Odia', value: 'Odia' },
  { label: 'Telugu', value: 'Telugu' },
];

const FORMATS = [
  { label: 'All Formats', value: '' },
  { label: '2D', value: '2D' },
  { label: '3D', value: '3D' },
  { label: 'IMAX 3D', value: 'IMAX 3D' },
  { label: '4DX', value: '4DX' },
];

export const MovieFilters: React.FC<MovieFiltersProps> = ({
  selectedGenre,
  onGenreChange,
  selectedLanguage,
  onLanguageChange,
  selectedFormat,
  onFormatChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="space-y-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {GENRES.map((g) => (
          <button
            key={g.value}
            onClick={() => onGenreChange(g.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === g.value
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Dropdown Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Language filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-violet-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Format filter */}
          <select
            value={selectedFormat}
            onChange={(e) => onFormatChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-violet-500"
          >
            {FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-violet-500"
          >
            <option value="popularity">Popularity (Most Voted)</option>
            <option value="rating">Critic & Audience Rating</option>
            <option value="releaseDate">Release Date</option>
          </select>
        </div>
      </div>
    </div>
  );
};
