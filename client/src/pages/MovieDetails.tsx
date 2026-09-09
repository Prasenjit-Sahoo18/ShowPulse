import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCity } from '../context/CityContext.js';
import { useAuth } from '../context/AuthContext.js';
import { movieApi, showApi } from '../services/api.js';
import { Movie, Show, Review } from '../types/index.js';
import { Badge } from '../components/common/Badge.js';
import { Button } from '../components/common/Button.js';
import { TrailerModal } from '../components/movies/TrailerModal.js';
import {
  Star,
  Clock,
  Calendar,
  Play,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedCity, selectedCityName, openCityModal } = useCity();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [isLoading, setIsLoading] = useState(true);

  // Trailer modal state
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  // Generate next 5 calendar dates for pill selector
  const availableDates = Array.from({ length: 5 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const movieData = await movieApi.getMovieById(id);
        setMovie(movieData);

        // Fetch shows for this movie in current city and date
        const showsData = await showApi.getShows({
          movieId: movieData.id,
          city: selectedCity,
          date: selectedDate,
        });
        setShows(showsData);
      } catch (err) {
        console.error('Failed to load movie details', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [id, selectedCity, selectedDate]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movie || !newComment.trim()) return;

    setIsSubmittingReview(true);
    setReviewMessage('');
    try {
      await movieApi.addMovieReview(movie.id, {
        rating: newRating,
        comment: newComment,
      });
      // Refresh movie data
      const updated = await movieApi.getMovieById(movie.id);
      setMovie(updated);
      setNewComment('');
      setReviewMessage('Your review has been posted!');
    } catch (err: any) {
      setReviewMessage(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading || !movie) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading cinematic experience...</p>
      </div>
    );
  }

  // Group shows by theatre
  const theatreShowsMap: { [theatreId: string]: { theatre: any; shows: Show[] } } = {};
  shows.forEach((show) => {
    if (!theatreShowsMap[show.theatreId]) {
      theatreShowsMap[show.theatreId] = { theatre: show.theatre, shows: [] };
    }
    theatreShowsMap[show.theatreId].shows.push(show);
  });

  const theatreGroups = Object.values(theatreShowsMap);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Backdrop Showcase Header */}
      <section className="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="absolute inset-0">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover opacity-25 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e17] via-[#0a0e17]/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Movie Poster */}
          <div className="w-48 sm:w-60 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-900 mx-auto md:mx-0">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="space-y-4 max-w-3xl flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-violet-600/30 border border-violet-500/40 text-violet-300">
                {movie.isNowShowing ? 'Now Showing in Theatres' : 'Coming Soon'}
              </span>
              <div className="flex gap-1">
                {movie.formats.map((fmt) => (
                  <Badge key={fmt} variant="secondary" size="sm">
                    {fmt}
                  </Badge>
                ))}
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {movie.title}
            </h1>

            {/* Quick Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{movie.rating > 0 ? movie.rating.toFixed(1) : 'New'}</span>
                <span className="text-xs text-slate-400 font-normal">({movie.voteCount} reviews)</span>
              </div>
              <span>•</span>
              <span className="font-semibold">{movie.language}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" />
                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </span>
              <span>•</span>
              <span>
                {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {movie.genres.map((g) => (
                <Badge key={g.id} variant="primary" size="md">
                  {g.name}
                </Badge>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-1">
              {movie.description}
            </p>

            {/* Cast and Crew */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800">
              <div>
                <span className="text-slate-400 block font-medium">Director</span>
                <span className="text-slate-200 font-bold text-sm">{movie.director}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Starring Cast</span>
                <span className="text-slate-200 font-semibold text-sm">
                  {movie.cast.join(', ')}
                </span>
              </div>
            </div>

            {/* Trailer Action */}
            {movie.trailerUrl && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Play className="w-4 h-4 text-violet-400 fill-violet-400" />}
                  onClick={() => setIsTrailerOpen(true)}
                >
                  Watch Official Trailer
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Theatre & Showtime Booking System */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-violet-400" />
              <span>Select Date & Showtimes</span>
            </h2>
            <p className="text-xs text-slate-400">
              Auditoriums showing in{' '}
              <button
                onClick={openCityModal}
                className="text-violet-400 font-bold underline hover:text-violet-300"
              >
                {selectedCityName}
              </button>
            </p>
          </div>
        </div>

        {/* Date Selector Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {availableDates.map((d) => {
            const isSelected = selectedDate === d.iso;
            return (
              <button
                key={d.iso}
                onClick={() => setSelectedDate(d.iso)}
                className={`flex flex-col items-center justify-center min-w-[76px] py-3 px-4 rounded-2xl border transition-all text-center ${
                  isSelected
                    ? 'bg-gradient-to-tr from-violet-600 to-fuchsia-600 border-violet-400 text-white shadow-lg shadow-violet-600/30 scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider">{d.dayName}</span>
                <span className="text-xl font-black">{d.dateNum}</span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">{d.month}</span>
              </button>
            );
          })}
        </div>

        {/* Theatres List with Showtime Pills */}
        <div className="space-y-4">
          {theatreGroups.length > 0 ? (
            theatreGroups.map(({ theatre, shows: theatreShows }) => (
              <div
                key={theatre.id}
                className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 hover:border-slate-700/80 transition-all shadow-md"
              >
                {/* Theatre Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{theatre.name}</span>
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>{theatre.location}</span>
                    </p>
                  </div>

                  {/* Facilities Badges */}
                  <div className="flex flex-wrap gap-1">
                    {theatre.facilities?.map((fac: string) => (
                      <span
                        key={fac}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes Pills */}
                <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800/80">
                  {theatreShows.map((show) => (
                    <button
                      key={show.id}
                      onClick={() => navigate(`/shows/${show.id}/seats`)}
                      className="group flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-violet-600 border border-slate-700/80 hover:border-violet-500 text-slate-200 hover:text-white transition-all duration-150 shadow-sm active:scale-95"
                    >
                      <span className="text-sm font-extrabold group-hover:text-white">
                        {show.startTime}
                      </span>
                      <span className="text-[10px] text-slate-400 group-hover:text-violet-200">
                        {show.screen?.name || 'Screen 1'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-2">
              <p className="text-sm font-semibold text-slate-300">
                No scheduled showtimes found for this date in {selectedCityName}.
              </p>
              <p className="text-xs text-slate-400">
                Try picking another date above or change your current city.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. User Reviews & Rating Section */}
      <section className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-violet-400" />
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Audience Reviews ({movie.reviews?.length || 0})
          </h3>
        </div>

        {/* Review Submission Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-white">Share Your Review & Rating</h4>
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-300 font-medium">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-400">{newRating} / 5 Stars</span>
              </div>

              <textarea
                rows={3}
                placeholder="Write your thoughts about the story, acting, direction, and cinematography..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
                required
              />

              {reviewMessage && (
                <div className="text-xs text-emerald-400 font-medium">{reviewMessage}</div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingReview}
                rightIcon={<Send className="w-3.5 h-3.5" />}
              >
                Post Review
              </Button>
            </form>
          ) : (
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Please</span>
              <Link to="/login" className="text-violet-400 font-semibold underline">
                Sign in
              </Link>
              <span>to submit a review for this movie.</span>
            </div>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {movie.reviews && movie.reviews.length > 0 ? (
            movie.reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-violet-600/30 text-violet-300 font-bold text-xs flex items-center justify-center">
                      {rev.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-white">{rev.user.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rev.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 col-span-2 py-4">
              Be the first to review this movie!
            </div>
          )}
        </div>
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </div>
  );
};
