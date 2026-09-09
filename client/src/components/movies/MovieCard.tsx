import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../../types/index.js';
import { Star, Clock } from 'lucide-react';
import { Badge } from '../common/Badge.js';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="group flex flex-col h-full bg-slate-900/70 dark:bg-slate-900/70 border border-slate-800/80 hover:border-violet-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-violet-600/10 transition-all duration-300">
      {/* Poster Image with overlays */}
      <Link to={`/movies/${movie.id}`} className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950 block">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
          }}
        />

        {/* Gradient shadow for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

        {/* Rating Badge */}
        {movie.rating > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-bold text-amber-400 shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
            <span className="text-[10px] text-slate-400 font-normal">({movie.voteCount})</span>
          </div>
        )}

        {/* Format Badges (e.g. IMAX, 3D) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {movie.formats.slice(0, 2).map((fmt) => (
            <span
              key={fmt}
              className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-violet-950/90 text-violet-300 border border-violet-500/40 shadow-sm backdrop-blur-sm"
            >
              {fmt}
            </span>
          ))}
        </div>
      </Link>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">{movie.language}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
            </span>
          </div>

          <Link to={`/movies/${movie.id}`}>
            <h3 className="font-bold text-base text-white group-hover:text-violet-400 transition-colors line-clamp-1">
              {movie.title}
            </h3>
          </Link>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {movie.genres.slice(0, 2).map((g) => (
              <Badge key={g.id} variant="secondary" size="sm">
                {g.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Book / Details Button */}
        <Link
          to={`/movies/${movie.id}`}
          className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all duration-200 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-md shadow-violet-600/20 active:scale-[0.98]"
        >
          {movie.isNowShowing ? 'Book Tickets' : 'Explore Details'}
        </Link>
      </div>
    </div>
  );
};
