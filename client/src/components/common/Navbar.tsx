import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { useCity } from '../../context/CityContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { movieApi } from '../../services/api.js';
import { Movie } from '../../types/index.js';
import {
  Search,
  MapPin,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  Ticket,
  ShieldAlert,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { selectedCityName, openCityModal } = useCity();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  // User menu dropdown & mobile drawer state
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Perform debounced search
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const runSearch = async () => {
      setIsSearching(true);
      try {
        const data = await movieApi.getMovies({ search: debouncedSearch, limit: 5 });
        setSearchResults(data.movies);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    };

    runSearch();
  }, [debouncedSearch]);

  // Click outside listener for search & user menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Movies', path: '/movies' },
    { label: 'Offers', path: '/offers' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0e17]/90 dark:bg-[#0a0e17]/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 p-0.5 shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                    CP
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                  Cine<span className="text-violet-400">Pulse</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                  Entertainment
                </span>
              </div>
            </Link>

            {/* City Selector Pill */}
            <button
              onClick={openCityModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 text-xs font-medium text-slate-200 hover:text-white transition-all group"
            >
              <MapPin className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
              <span>{selectedCityName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Global Search Bar */}
          <div className="relative flex-1 max-w-md hidden md:block" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search movies, theatres, genres..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>

            {/* Live Search Suggestions Dropdown */}
            {isSearchOpen && (searchQuery.trim().length > 0 || searchResults.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-400">Searching CinePulse...</div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                      Movies Found
                    </div>
                    {searchResults.map((m) => (
                      <Link
                        key={m.id}
                        to={`/movies/${m.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          className="w-10 h-14 object-cover rounded-lg shrink-0 shadow"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{m.title}</div>
                          <div className="text-xs text-slate-400 truncate">
                            {m.language} • {m.genres.map((g) => g.name).join(', ')}
                          </div>
                        </div>
                        <div className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
                          ★ {m.rating.toFixed(1)}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Navigation & User Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-violet-400 bg-violet-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Toggle Light / Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-sm font-medium text-white transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          ADMINISTRATOR
                        </span>
                      )}
                    </div>

                    <Link
                      to="/my-bookings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-violet-400" />
                      <span>My Bookings</span>
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-violet-400" />
                      <span>Profile Settings</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-slate-800 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl shadow-md shadow-violet-600/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {/* Mobile City Selector */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              openCityModal();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-200"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-violet-400" />
              <span>City: {selectedCityName}</span>
            </div>
            <span className="text-xs text-violet-400">Change</span>
          </button>

          {/* Mobile Navigation Links */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              to="/movies"
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-medium text-sm text-slate-200"
            >
              All Movies
            </Link>
            <Link
              to="/offers"
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-medium text-sm text-slate-200"
            >
              Offers & Deals
            </Link>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="block p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center font-semibold text-sm text-amber-400"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
