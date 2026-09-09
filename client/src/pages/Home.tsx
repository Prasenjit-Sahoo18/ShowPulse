import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCity } from '../context/CityContext.js';
import { movieApi, theatreApi, couponApi } from '../services/api.js';
import { Movie, Theatre, Coupon } from '../types/index.js';
import { MovieCard } from '../components/movies/MovieCard.js';
import { MovieCardSkeleton } from '../components/common/Skeleton.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { TrailerModal } from '../components/movies/TrailerModal.js';
import {
  Play,
  Sparkles,
  ChevronRight,
  MapPin,
  Tag,
  Star,
  Film,
  Flame,
  Calendar,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { selectedCity, selectedCityName } = useCity();
  const navigate = useNavigate();

  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Trailer modal state
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [trailerTitle, setTrailerTitle] = useState('');
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      setIsLoading(true);
      try {
        const [nowShowingData, comingSoonData, theatresData, couponsData] = await Promise.all([
          movieApi.getMovies({ status: 'nowShowing', city: selectedCity, limit: 8 }),
          movieApi.getMovies({ status: 'comingSoon', limit: 4 }),
          theatreApi.getTheatres({ city: selectedCity }),
          couponApi.getActiveCoupons(),
        ]);

        setNowShowing(nowShowingData.movies);
        setComingSoon(comingSoonData.movies);
        setTheatres(theatresData.slice(0, 4));
        setCoupons(couponsData.slice(0, 3));

        // Pick featured movie (or first now showing)
        const featured = nowShowingData.movies.find((m) => m.isFeatured) || nowShowingData.movies[0];
        setFeaturedMovie(featured || null);
      } catch (err) {
        console.error('Error fetching home content', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, [selectedCity]);

  const openTrailer = (movie: Movie) => {
    if (movie.trailerUrl) {
      setTrailerUrl(movie.trailerUrl);
      setTrailerTitle(movie.title);
      setIsTrailerOpen(true);
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Promotional Showcase Banner */}
      {featuredMovie ? (
        <section className="relative w-full min-h-[520px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex items-center">
          {/* Backdrop Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={featuredMovie.backdropUrl || featuredMovie.posterUrl}
              alt={featuredMovie.title}
              className="w-full h-full object-cover object-center opacity-30 blur-[1px] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e17] via-[#0a0e17]/90 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Poster Card */}
            <div className="w-52 sm:w-64 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-violet-950/60 border border-slate-700/80 hidden sm:block">
              <img
                src={featuredMovie.posterUrl}
                alt={featuredMovie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details & CTA */}
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/30 border border-violet-500/50 text-violet-300 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Featured Blockbuster
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Playing in {selectedCityName}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {featuredMovie.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{featuredMovie.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>{featuredMovie.language}</span>
                <span>•</span>
                <span>{Math.floor(featuredMovie.duration / 60)}h {featuredMovie.duration % 60}m</span>
                <span>•</span>
                <div className="flex gap-1.5">
                  {featuredMovie.formats.map((fmt) => (
                    <Badge key={fmt} variant="secondary" size="sm">
                      {fmt}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed">
                {featuredMovie.description}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(`/movies/${featuredMovie.id}`)}
                >
                  Book Tickets Now
                </Button>

                {featuredMovie.trailerUrl && (
                  <Button
                    variant="secondary"
                    size="lg"
                    leftIcon={<Play className="w-4 h-4 text-violet-400 fill-violet-400" />}
                    onClick={() => openTrailer(featuredMovie)}
                  >
                    Watch Trailer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 2. Recommended & Now Showing Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-violet-400" />
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Now Showing</h2>
            </div>
            <p className="text-xs text-slate-400">
              Catch the biggest cinema releases playing today in <span className="text-violet-400 font-semibold">{selectedCityName}</span>
            </p>
          </div>

          <Link
            to="/movies"
            className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            <span>See All Movies</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : nowShowing.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {nowShowing.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 p-8 space-y-2">
            <p className="text-slate-300 font-semibold">No active shows found in {selectedCityName} right now.</p>
            <p className="text-xs text-slate-400">Try switching your city or explore upcoming movies below.</p>
          </div>
        )}
      </section>

      {/* 3. Exclusive Deals & Coupons Strip */}
      {coupons.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white tracking-tight">Best Offers & Deals</h3>
            </div>
            <Link to="/offers" className="text-xs font-semibold text-violet-400 hover:underline">
              View All Offers
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-violet-500/40 p-4 rounded-2xl shadow-md space-y-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-lg border border-violet-500/20">
                    {coupon.code}
                  </span>
                  <Badge variant="accent" size="sm">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">{coupon.description}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Min. Booking: ₹{coupon.minAmount}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Coming Soon / Upcoming Blockbusters */}
      {comingSoon.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-fuchsia-400" />
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Coming Soon</h2>
              </div>
              <p className="text-xs text-slate-400">Mark your calendar for upcoming anticipated cinema titles</p>
            </div>

            <Link
              to="/movies?status=comingSoon"
              className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              <span>Explore Upcoming</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {comingSoon.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Popular Theatres in City */}
      {theatres.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-violet-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Top Theatres in {selectedCityName}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {theatres.map((theatre) => (
              <div
                key={theatre.id}
                className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-slate-700 transition-colors"
              >
                <h4 className="font-bold text-sm text-white truncate">{theatre.name}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{theatre.location}</span>
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {theatre.facilities.slice(0, 2).map((fac) => (
                    <span
                      key={fac}
                      className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={trailerUrl}
        movieTitle={trailerTitle}
      />
    </div>
  );
};
