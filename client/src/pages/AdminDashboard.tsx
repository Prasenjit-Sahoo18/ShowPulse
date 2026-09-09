import React, { useEffect, useState } from 'react';
import { adminApi, cityApi, movieApi, theatreApi } from '../services/api.js';
import { Movie, Theatre, Booking, User, City } from '../types/index.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Modal } from '../components/common/Modal.js';
import {
  ShieldAlert,
  BarChart3,
  Film,
  Building2,
  Calendar,
  Ticket,
  Users,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  DollarSign,
  TrendingUp,
  Percent,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'movies' | 'theatres' | 'shows' | 'bookings' | 'users'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & filter for bookings
  const [bookingSearch, setBookingSearch] = useState('');

  // Modals state
  const [isAddMovieModal, setIsAddMovieModal] = useState(false);
  const [isAddTheatreModal, setIsAddTheatreModal] = useState(false);
  const [isAddShowModal, setIsAddShowModal] = useState(false);

  // New movie form state
  const [newMovie, setNewMovie] = useState({
    title: '',
    slug: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    trailerUrl: '',
    duration: 140,
    releaseDate: new Date().toISOString().split('T')[0],
    rating: 4.5,
    language: 'English',
    director: '',
    cast: 'Actor 1, Actor 2',
    isNowShowing: true,
    isFeatured: false,
    isComingSoon: false,
  });

  // New theatre form state
  const [newTheatre, setNewTheatre] = useState({
    name: '',
    cityId: '',
    location: '',
    address: '',
    facilities: 'Dolby Atmos, 4K Projection, Valet Parking',
  });

  // New show form state
  const [newShow, setNewShow] = useState({
    movieId: '',
    theatreId: '',
    screenId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '07:30 PM',
    endTime: '10:15 PM',
    basePriceMultiplier: 1.1,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [analyticsData, moviesData, theatresData, bookingsData, usersData, citiesData] =
        await Promise.all([
          adminApi.getAnalytics(),
          movieApi.getMovies({ limit: 50 }),
          theatreApi.getTheatres(),
          adminApi.getBookings({ search: bookingSearch || undefined }),
          adminApi.getUsers(),
          cityApi.getCities(),
        ]);

      setAnalytics(analyticsData);
      setMovies(moviesData.movies);
      setTheatres(theatresData);
      setBookings(bookingsData.bookings);
      setUsers(usersData);
      setCities(citiesData);

      if (citiesData.length > 0 && !newTheatre.cityId) {
        setNewTheatre((prev) => ({ ...prev, cityId: citiesData[0].id }));
      }
      if (moviesData.movies.length > 0 && !newShow.movieId) {
        setNewShow((prev) => ({ ...prev, movieId: moviesData.movies[0].id }));
      }
      if (theatresData.length > 0 && !newShow.theatreId) {
        setNewShow((prev) => ({
          ...prev,
          theatreId: theatresData[0].id,
          screenId: theatresData[0].screens?.[0]?.id || '',
        }));
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [bookingSearch]);

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createMovie({
        ...newMovie,
        duration: Number(newMovie.duration),
        rating: Number(newMovie.rating),
        cast: newMovie.cast.split(',').map((c) => c.trim()),
        formats: ['2D', '3D'],
        genreIds: [],
      });
      setIsAddMovieModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create movie');
    }
  };

  const handleDeleteMovie = async (id: string) => {
    if (!window.confirm('Delete this movie and all associated shows?')) return;
    try {
      await adminApi.deleteMovie(id);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateTheatre = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createTheatre({
        ...newTheatre,
        facilities: newTheatre.facilities.split(',').map((f) => f.trim()),
      });
      setIsAddTheatreModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create theatre');
    }
  };

  const handleCreateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createShow({
        ...newShow,
        basePriceMultiplier: Number(newShow.basePriceMultiplier),
      });
      setIsAddShowModal(false);
      alert('Show scheduled successfully!');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to schedule show');
    }
  };

  const handleRefundBooking = async (id: string) => {
    if (!window.confirm('Cancel this booking and release seats back to inventory?')) return;
    try {
      await adminApi.refundBooking(id);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleUser = async (id: string) => {
    try {
      await adminApi.toggleUserStatus(id);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Admin Console</h1>
              <p className="text-xs text-slate-400">
                Enterprise operations, catalogue management, and revenue metrics.
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
          onClick={loadData}
        >
          Refresh Data
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'analytics', label: 'Analytics & KPIs', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'movies', label: `Movies (${movies.length})`, icon: <Film className="w-4 h-4" /> },
          { id: 'theatres', label: `Theatres (${theatres.length})`, icon: <Building2 className="w-4 h-4" /> },
          { id: 'shows', label: 'Schedule Shows', icon: <Calendar className="w-4 h-4" /> },
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: <Ticket className="w-4 h-4" /> },
          { id: 'users', label: `Users (${users.length})`, icon: <Users className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ---------------- TAB 1: ANALYTICS OVERVIEW ---------------- */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8">
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                title: 'Total Revenue',
                val: `₹${analytics.metrics.totalRevenue.toLocaleString()}`,
                sub: 'Lifetime gross revenue',
                icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
                color: 'border-emerald-500/20 bg-emerald-500/5',
              },
              {
                title: 'Total Bookings',
                val: analytics.metrics.totalBookings,
                sub: 'Transactions processed',
                icon: <Ticket className="w-5 h-5 text-violet-400" />,
                color: 'border-violet-500/20 bg-violet-500/5',
              },
              {
                title: "Today's Bookings",
                val: analytics.metrics.todayBookings,
                sub: 'Past 24 hours',
                icon: <TrendingUp className="w-5 h-5 text-fuchsia-400" />,
                color: 'border-fuchsia-500/20 bg-fuchsia-500/5',
              },
              {
                title: 'Occupancy Rate',
                val: `${analytics.metrics.occupancyRate}%`,
                sub: 'Active auditorium seats',
                icon: <Percent className="w-5 h-5 text-amber-400" />,
                color: 'border-amber-500/20 bg-amber-500/5',
              },
              {
                title: 'Active Movies',
                val: analytics.metrics.totalMovies,
                sub: 'In catalogue',
                icon: <Film className="w-5 h-5 text-cyan-400" />,
                color: 'border-cyan-500/20 bg-cyan-500/5',
              },
              {
                title: 'Registered Users',
                val: analytics.metrics.totalUsers,
                sub: 'Total customer base',
                icon: <Users className="w-5 h-5 text-blue-400" />,
                color: 'border-blue-500/20 bg-blue-500/5',
              },
            ].map((kpi, i) => (
              <div
                key={i}
                className={`p-4 rounded-3xl border ${kpi.color} space-y-2 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  {kpi.icon}
                </div>
                <div className="text-2xl font-black text-white">{kpi.val}</div>
                <div className="text-[10px] text-slate-400">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Revenue Trend Visual Bar Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">7-Day Revenue & Booking Volume</h3>
                <p className="text-xs text-slate-400">Weekly trend distribution across all partner screens</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-violet-600/20 text-violet-300 border border-violet-500/30">
                Live Data
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-56 pt-6 pb-2 border-b border-slate-800">
              {analytics.revenueChartData?.map((item: any) => {
                const maxVal = Math.max(...analytics.revenueChartData.map((d: any) => d.revenue)) || 1;
                const heightPercent = Math.max(15, Math.round((item.revenue / maxVal) * 100));

                return (
                  <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{item.revenue}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-violet-600 to-fuchsia-500 group-hover:from-violet-500 group-hover:to-fuchsia-400 transition-all shadow-md shadow-violet-600/20"
                    />
                    <span className="text-xs font-bold text-slate-300">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: MOVIES MANAGEMENT ---------------- */}
      {activeTab === 'movies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Movies Catalogue</h3>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddMovieModal(true)}
            >
              Add New Movie
            </Button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Movie</th>
                    <th className="p-4">Language / Duration</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {movies.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          className="w-10 h-14 object-cover rounded-lg shadow shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{m.title}</div>
                          <div className="text-slate-400 text-[11px]">{m.director}</div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">
                        {m.language} • {m.duration} mins
                      </td>
                      <td className="p-4 font-bold text-amber-400">★ {m.rating.toFixed(1)}</td>
                      <td className="p-4">
                        <Badge variant={m.isNowShowing ? 'success' : 'secondary'} size="sm">
                          {m.isNowShowing ? 'Now Showing' : 'Coming Soon'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteMovie(m.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete movie"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: THEATRES MANAGEMENT ---------------- */}
      {activeTab === 'theatres' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Theatres & Multiplexes</h3>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddTheatreModal(true)}
            >
              Add Theatre
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {theatres.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-base text-white">{t.name}</h4>
                    <p className="text-xs text-slate-400">{t.location}</p>
                  </div>
                  <Badge variant="primary" size="sm">
                    {t.screens?.length || 2} Screens
                  </Badge>
                </div>

                <p className="text-xs text-slate-400">{t.address}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {t.facilities.map((fac) => (
                    <span
                      key={fac}
                      className="text-[10px] font-medium bg-slate-800 px-2 py-0.5 rounded text-slate-300"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 4: SCHEDULE SHOWS ---------------- */}
      {activeTab === 'shows' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Auditorium Show Scheduling</h3>
              <p className="text-xs text-slate-400">
                Link movies to theatre screens, configure showtimes, and automatically generate seat inventory.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddShowModal(true)}
            >
              Schedule New Show
            </Button>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <p className="text-xs text-slate-300">
              There are currently over 120 scheduled shows actively loaded in PostgreSQL with full seat layouts. Click "Schedule New Show" above to add new slots!
            </p>
          </div>
        </div>
      )}

      {/* ---------------- TAB 5: BOOKINGS & REFUNDS ---------------- */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white">Customer Bookings & Auditing</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search reference, user, movie..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Movie & Theatre</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-violet-400">{b.bookingReference}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{b.user?.name}</div>
                        <div className="text-slate-400 text-[11px]">{b.user?.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{b.show?.movie?.title}</div>
                        <div className="text-slate-400 text-[11px]">{b.show?.theatre?.name}</div>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">₹{b.totalAmount.toFixed(2)}</td>
                      <td className="p-4">
                        <Badge
                          variant={b.status === 'CONFIRMED' ? 'success' : 'danger'}
                          size="sm"
                        >
                          {b.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleRefundBooking(b.id)}
                            className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline"
                          >
                            Refund & Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 6: USERS MANAGEMENT ---------------- */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">Registered Users</h3>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Bookings</th>
                    <th className="p-4 text-right">Toggle Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-slate-400 text-[11px]">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant={u.role === 'ADMIN' ? 'accent' : 'secondary'} size="sm">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={u.isActive ? 'success' : 'danger'} size="sm">
                          {u.isActive ? 'Active' : 'Disabled'}
                        </Badge>
                      </td>
                      <td className="p-4 font-bold text-slate-300">{u._count?.bookings || 0}</td>
                      <td className="p-4 text-right">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleUser(u.id)}
                            className="text-xs text-violet-400 hover:underline font-semibold"
                          >
                            {u.isActive ? 'Disable User' : 'Enable User'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODALS ---------------- */}
      {/* 1. Add Movie Modal */}
      <Modal isOpen={isAddMovieModal} onClose={() => setIsAddMovieModal(false)} title="Add New Movie" maxWidth="lg">
        <form onSubmit={handleCreateMovie} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Movie Title</label>
            <input
              type="text"
              required
              value={newMovie.title}
              onChange={(e) =>
                setNewMovie({
                  ...newMovie,
                  title: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                })
              }
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Poster URL</label>
            <input
              type="url"
              required
              value={newMovie.posterUrl}
              onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Backdrop URL</label>
            <input
              type="url"
              required
              value={newMovie.backdropUrl}
              onChange={(e) => setNewMovie({ ...newMovie, backdropUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Language</label>
              <input
                type="text"
                required
                value={newMovie.language}
                onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Duration (min)</label>
              <input
                type="number"
                required
                value={newMovie.duration}
                onChange={(e) => setNewMovie({ ...newMovie, duration: Number(e.target.value) })}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Director</label>
            <input
              type="text"
              required
              value={newMovie.director}
              onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
            <textarea
              required
              rows={2}
              value={newMovie.description}
              onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="w-full mt-2">
            Save Movie to Catalogue
          </Button>
        </form>
      </Modal>

      {/* 2. Add Theatre Modal */}
      <Modal isOpen={isAddTheatreModal} onClose={() => setIsAddTheatreModal(false)} title="Add Theatre" maxWidth="md">
        <form onSubmit={handleCreateTheatre} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Theatre Name</label>
            <input
              type="text"
              required
              value={newTheatre.name}
              onChange={(e) => setNewTheatre({ ...newTheatre, name: e.target.value })}
              placeholder="CinePulse Nexus Mall"
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">City</label>
            <select
              value={newTheatre.cityId}
              onChange={(e) => setNewTheatre({ ...newTheatre, cityId: e.target.value })}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Location / Area</label>
            <input
              type="text"
              required
              value={newTheatre.location}
              onChange={(e) => setNewTheatre({ ...newTheatre, location: e.target.value })}
              placeholder="Patia, Infocity"
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Full Address</label>
            <input
              type="text"
              required
              value={newTheatre.address}
              onChange={(e) => setNewTheatre({ ...newTheatre, address: e.target.value })}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="w-full mt-2">
            Create Theatre
          </Button>
        </form>
      </Modal>

      {/* 3. Schedule Show Modal */}
      <Modal isOpen={isAddShowModal} onClose={() => setIsAddShowModal(false)} title="Schedule Show" maxWidth="md">
        <form onSubmit={handleCreateShow} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Select Movie</label>
            <select
              value={newShow.movieId}
              onChange={(e) => setNewShow({ ...newShow, movieId: e.target.value })}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
            >
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Select Theatre</label>
            <select
              value={newShow.theatreId}
              onChange={(e) => {
                const t = theatres.find((th) => th.id === e.target.value);
                setNewShow({
                  ...newShow,
                  theatreId: e.target.value,
                  screenId: t?.screens?.[0]?.id || '',
                });
              }}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
            >
              {theatres.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.location})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Date</label>
              <input
                type="date"
                required
                value={newShow.date}
                onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Start Time</label>
              <input
                type="text"
                required
                value={newShow.startTime}
                onChange={(e) => setNewShow({ ...newShow, startTime: e.target.value })}
                placeholder="07:30 PM"
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>
          <Button type="submit" variant="primary" size="md" className="w-full mt-2">
            Publish Show & Generate Seats
          </Button>
        </form>
      </Modal>
    </div>
  );
};
