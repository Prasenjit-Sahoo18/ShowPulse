import React from 'react';
import { Booking } from '../../types/index.js';
import { Button } from '../common/Button.js';
import { Printer, MapPin, Calendar, Clock, Film, ShieldCheck } from 'lucide-react';

interface TicketCardProps {
  booking: Booking;
}

export const TicketCard: React.FC<TicketCardProps> = ({ booking }) => {
  const handlePrint = () => {
    window.print();
  };

  const show = booking.show;
  const movie = show?.movie;
  const theatre = show?.theatre;
  const screen = show?.screen;

  const showDate = show?.date
    ? new Date(show.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const seatLabels = booking.bookingSeats?.map((bs) => `${bs.seat?.row}${bs.seat?.number}`).join(', ') || '';

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Printable Digital Cinema Ticket */}
      <div
        id="printable-ticket"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl relative text-white"
      >
        {/* Top Header Strip */}
        <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-white" />
            <span className="font-black text-sm uppercase tracking-wider text-white">
              CinePulse Admission Ticket
            </span>
          </div>
          <span className="text-xs font-mono font-bold bg-black/30 px-2.5 py-1 rounded-md text-white backdrop-blur-sm">
            {booking.bookingReference}
          </span>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-6">
          {/* Movie & Poster Row */}
          <div className="flex gap-4">
            {movie?.posterUrl && (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-xl shadow-md shrink-0 border border-slate-700"
              />
            )}
            <div className="space-y-1.5 min-w-0">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {screen?.screenType || 'Digital 2D'}
              </span>
              <h2 className="text-xl font-black text-white truncate">{movie?.title}</h2>
              <div className="text-xs text-slate-400">
                {movie?.language} • {movie?.duration} Mins
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <span className="truncate">{theatre?.name}</span>
              </div>
            </div>
          </div>

          {/* Show Details Grid */}
          <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-center text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3" /> Date
              </span>
              <p className="font-bold text-slate-200 mt-1">{showDate}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> Time
              </span>
              <p className="font-bold text-slate-200 mt-1">{show?.startTime}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold">Auditorium</span>
              <p className="font-bold text-slate-200 mt-1">{screen?.name || 'Screen 1'}</p>
            </div>
          </div>

          {/* Seats & Price */}
          <div className="flex items-center justify-between px-2 text-sm">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Reserved Seats</span>
              <span className="font-extrabold text-violet-300 text-base">{seatLabels}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Total Paid</span>
              <span className="font-black text-emerald-400 text-base">₹{booking.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex items-center justify-between w-full px-2 py-1">
          <div className="w-6 h-6 rounded-full bg-[#0a0e17] -ml-5 border-r border-slate-700" />
          <div className="flex-1 border-t-2 border-dashed border-slate-700 mx-2" />
          <div className="w-6 h-6 rounded-full bg-[#0a0e17] -mr-5 border-l border-slate-700" />
        </div>

        {/* Bottom QR Section */}
        <div className="p-6 pt-4 flex items-center justify-between bg-slate-950/60">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Entry Pass</span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-[200px]">
              Scan QR code at the cinema turnstile for instant contactless check-in.
            </p>
            <p className="text-[10px] font-mono text-slate-400">STATUS: {booking.status}</p>
          </div>

          {/* QR Code */}
          {booking.qrCodeData ? (
            <div className="p-2 bg-white rounded-2xl shadow-lg shrink-0">
              <img src={booking.qrCodeData} alt="Ticket QR Code" className="w-24 h-24" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center text-[10px] text-slate-400">
              No QR
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 print:hidden">
        <Button
          variant="outline"
          size="md"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={handlePrint}
        >
          Print / Save Ticket
        </Button>
      </div>
    </div>
  );
};
