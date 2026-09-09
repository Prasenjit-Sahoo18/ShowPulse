import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { bookingApi } from '../services/api.js';
import { Booking } from '../types/index.js';
import { TicketCard } from '../components/booking/TicketCard.js';
import { Button } from '../components/common/Button.js';
import { CheckCircle2, Ticket, Home, ArrowLeft } from 'lucide-react';

export const BookingConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>((location.state as any)?.booking || null);
  const [isLoading, setIsLoading] = useState(!booking);

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // If booking was not in navigation state, fetch from API
    if (!booking && id) {
      const fetchBooking = async () => {
        try {
          const data = await bookingApi.getBookingById(id);
          setBooking(data);
        } catch (err) {
          console.error('Failed to load booking', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBooking();
    }
  }, [id]);

  if (isLoading || !booking) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading your confirmed ticket...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      {/* Celebratory Banner */}
      <div className="text-center space-y-3 pt-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          🎉 Booking Confirmed!
        </h1>
        <p className="text-sm text-slate-300">
          Your reservation is verified. We've generated your digital entrance pass below.
        </p>
      </div>

      {/* Ticket Card with QR Code */}
      <TicketCard booking={booking} />

      {/* Bottom Navigation CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 print:hidden">
        <Button
          variant="primary"
          size="md"
          leftIcon={<Ticket className="w-4 h-4" />}
          onClick={() => navigate('/my-bookings')}
        >
          View in My Bookings
        </Button>

        <Button
          variant="secondary"
          size="md"
          leftIcon={<Home className="w-4 h-4" />}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};
