import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../services/api.js';
import { Booking } from '../types/index.js';
import { TicketCard } from '../components/booking/TicketCard.js';
import { Modal } from '../components/common/Modal.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import {
  Ticket,
  MapPin,
  Calendar,
  Clock,
  Printer,
  XCircle,
  Eye,
  Film,
} from 'lucide-react';

export const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingApi.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load user bookings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking? The seats will be released and refund initiated.')) {
      return;
    }

    setCancellingId(bookingId);
    setMessage('');
    try {
      await bookingApi.cancelBooking(bookingId);
      setMessage('Booking cancelled successfully. Refund initiated to original payment method.');
      await fetchBookings();
    } catch (err: any) {
      setMessage(err.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <Ticket className="w-7 h-7 text-violet-400" />
          <span>My Booking History</span>
        </h1>
        <p className="text-xs text-slate-400">
          Manage your active reservations, view QR admission passes, and track refunds.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-violet-600/20 border border-violet-500/40 rounded-2xl text-xs font-semibold text-violet-300">
          {message}
        </div>
      )}

      {/* Bookings List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading your reservations...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((b) => {
            const show = b.show;
            const movie = show?.movie;
            const isCancelled = b.status === 'CANCELLED';
            const seatList = b.bookingSeats?.map((bs) => `${bs.seat?.row}${bs.seat?.number}`).join(', ');

            return (
              <div
                key={b.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-lg hover:border-slate-700 transition-all"
              >
                <div className="flex gap-4 items-center">
                  {movie?.posterUrl && (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-xl shadow shrink-0 border border-slate-800"
                    />
                  )}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                        {b.bookingReference}
                      </span>
                      <Badge
                        variant={isCancelled ? 'danger' : 'success'}
                        size="sm"
                      >
                        {b.status}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-base text-white truncate">{movie?.title}</h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-violet-400" />
                        {show?.theatre?.name}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(show?.date).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {show?.startTime}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300">
                      Seats: <span className="font-bold text-violet-300">{seatList}</span> (₹{b.totalAmount.toFixed(2)})
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap sm:flex-col items-end gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setSelectedBooking(b)}
                  >
                    View Ticket & QR
                  </Button>

                  {!isCancelled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      isLoading={cancellingId === b.id}
                      leftIcon={<XCircle className="w-3.5 h-3.5 text-rose-400" />}
                      className="text-rose-400 hover:text-rose-300"
                      onClick={() => handleCancelBooking(b.id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-4">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Bookings Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't booked any movie tickets yet. Explore now showing blockbusters in your city!
          </p>
          <Link to="/movies">
            <Button variant="primary" size="md">
              Discover Movies
            </Button>
          </Link>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title="Digital Admission Ticket"
          maxWidth="lg"
        >
          <TicketCard booking={selectedBooking} />
        </Modal>
      )}
    </div>
  );
};
