import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useBooking } from '../context/BookingContext.js';
import { showApi } from '../services/api.js';
import { ShowSeatItem } from '../types/index.js';
import { SeatLegend } from '../components/booking/SeatLegend.js';
import { SeatGrid } from '../components/booking/SeatGrid.js';
import { BookingSummary } from '../components/booking/BookingSummary.js';
import { SeatGridSkeleton } from '../components/common/Skeleton.js';
import { useCountdown } from '../hooks/useCountdown.js';
import { Film, MapPin, Calendar, Clock, ChevronLeft, AlertCircle } from 'lucide-react';

export const SeatSelection: React.FC = () => {
  const { id: showId } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    selectedSeats,
    toggleSeat,
    clearSeats,
    setActiveShow,
  } = useBooking();

  const [showInfo, setShowInfo] = useState<any>(null);
  const [seats, setSeats] = useState<ShowSeatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lockExpiresAt, setLockExpiresAt] = useState<string | null>(null);
  const [isLocking, setIsLocking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const countdown = useCountdown(lockExpiresAt, () => {
    setErrorMessage('Your 10-minute seat reservation has expired. Please re-select your seats.');
    clearSeats();
    setLockExpiresAt(null);
  });

  const fetchSeats = async () => {
    if (!showId) return;
    setIsLoading(true);
    try {
      const data = await showApi.getShowSeats(showId);
      setShowInfo(data.show);
      setSeats(data.seats);
      setActiveShow(data.show);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load auditorium seating layout.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    clearSeats();
    fetchSeats();
  }, [showId]);

  const handleSeatClick = (seat: ShowSeatItem) => {
    setErrorMessage('');
    toggleSeat(seat);
  };

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) return;

    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsLocking(true);
    setErrorMessage('');

    try {
      const seatIds = selectedSeats.map((s) => s.seatId);
      const lockRes = await showApi.lockSeats(showId!, seatIds);
      setLockExpiresAt(lockRes.lockExpiresAt);

      // Navigate to Checkout page with showId and seatIds in state
      navigate(`/checkout/${showId}`, {
        state: {
          showId,
          showInfo,
          selectedSeats,
          lockExpiresAt: lockRes.lockExpiresAt,
        },
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'One or more of your selected seats was just taken. Please refresh.');
      // Refresh seat layout
      await fetchSeats();
    } finally {
      setIsLocking(false);
    }
  };

  if (isLoading || !showInfo) {
    return (
      <div className="py-12 space-y-6">
        <div className="h-8 bg-slate-800 rounded w-1/3 animate-pulse" />
        <SeatGridSkeleton />
      </div>
    );
  }

  const selectedSeatIds = selectedSeats.map((s) => s.seatId);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb & Showtime Info Strip */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-violet-400" />
              <span>{showInfo.movie?.title}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-violet-400" />
                {showInfo.theatre?.name}
              </span>
              <span>•</span>
              <span className="font-semibold text-violet-400">{showInfo.screenName}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(showInfo.date).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {showInfo.startTime}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs text-slate-400 block">Experience</span>
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
            {showInfo.screenType}
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-300 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Seat Legend */}
      <SeatLegend />

      {/* Main Layout: Interactive Auditorium Grid + Checkout Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Seat Layout (Takes 3 columns on large screens) */}
        <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-lg">
          <SeatGrid
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onSeatClick={handleSeatClick}
          />
        </div>

        {/* Real-Time Booking Summary Sidebar */}
        <div className="lg:col-span-1 sticky top-24">
          <BookingSummary
            onProceed={handleProceedToPayment}
            isLoading={isLocking}
            countdownFormatted={lockExpiresAt ? countdown.formatted : undefined}
          />
        </div>
      </div>
    </div>
  );
};
