import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCity } from '../context/CityContext.js';
import { movieApi } from '../services/api.js';
import { Movie } from '../types/index.js';
import { MovieCard } from '../components/movies/MovieCard.js';
import { MovieFilters } from '../components/movies/MovieFilters.js';
import { MovieCardSkeleton } from '../components/common/Skeleton.js';
import { Film, Search } from 'lucide-react';

export const Movies: React.FC = () => {
  const { selectedCity, selectedCityName } = useCity();
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state initialized from query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || '');
  const [selectedFormat, setSelectedFormat] = useState(searchParams.get('format') || '');
  const [statusFilter, setStatusFilter] = useState<'nowShowing' | 'comingSoon' | 'all'>(
    (searchParams.get('status') as any) || 'all'
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'popularity');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const data = await movieApi.getMovies({
        search: search || undefined,
        genre: selectedGenre || undefined,
        language: selectedLanguage || undefined,
        format: selectedFormat || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        city: statusFilter === 'nowShowing' ? selectedCity : undefined,
        sortBy: sortBy as any,
        page: currentPage,
        limit: 12,
      });

      setMovies(data.movies);
      setTotalPages(data.pagination.totalPages);
      setTotalCount(data.pagination.total);
    } catch (err) {
      console.error('Failed to load movies', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [
    search,
    selectedGenre,
    selectedLanguage,
    selectedFormat,
    statusFilter,
    sortBy,
    currentPage,
    selectedCity,
  ]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-violet-400" />
            <h1 className="text-3xl font-black text-white tracking-tight">Browse Movies</h1>
          </div>
          <p className="text-xs text-slate-400">
            Showing movies available for booking in <span className="text-violet-400 font-semibold">{selectedCityName}</span>
          </p>
        </div>

        {/* Status Tabs: All, Now Showing, Coming Soon */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-2xl w-fit">
          <button
            onClick={() => {
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Movies
          </button>
          <button
            onClick={() => {
              setStatusFilter('nowShowing');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'nowShowing'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Now Showing
          </button>
          <button
            onClick={() => {
              setStatusFilter('comingSoon');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'comingSoon'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Coming Soon
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <MovieFilters
        selectedGenre={selectedGenre}
        onGenreChange={(g) => {
          setSelectedGenre(g);
          setCurrentPage(1);
        }}
        selectedLanguage={selectedLanguage}
        onLanguageChange={(l) => {
          setSelectedLanguage(l);
          setCurrentPage(1);
        }}
        selectedFormat={selectedFormat}
        onFormatChange={(f) => {
          setSelectedFormat(f);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(s) => {
          setSortBy(s);
          setCurrentPage(1);
        }}
      />

      {/* Results Header */}
      <div className="text-xs font-semibold text-slate-400">
        Found {totalCount} {totalCount === 1 ? 'movie' : 'movies'} matching your preferences
      </div>

      {/* Movie Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Movies Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to see more results.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-xs font-bold text-slate-400 px-3">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
