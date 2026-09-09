import React from 'react';
import { useBooking } from '../../context/BookingContext.js';
import { Button } from '../common/Button.js';
import { Tag, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface BookingSummaryProps {
  onProceed: () => void;
  isLoading?: boolean;
  lockExpiresAt?: string | null;
  countdownFormatted?: string;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  onProceed,
  isLoading = false,
  countdownFormatted,
}) => {
  const {
    selectedSeats,
    seatNames,
    ticketSubtotal,
    convenienceFee,
    discountAmount,
    grandTotal,
    appliedCoupon,
    removeCoupon,
  } = useBooking();

  if (selectedSeats.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl text-center text-slate-400 space-y-2">
        <p className="text-sm font-medium text-slate-300">No seats selected yet</p>
        <p className="text-xs">Click on available seats in the auditorium map to reserve them.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header & Seat Count */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Booking Summary</h4>
          <p className="text-xs text-slate-400">
            {selectedSeats.length} {selectedSeats.length === 1 ? 'Ticket' : 'Tickets'} Selected
          </p>
        </div>
        {countdownFormatted && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Hold: {countdownFormatted}</span>
          </div>
        )}
      </div>

      {/* Selected Seats Pills */}
      <div className="space-y-1">
        <span className="text-xs text-slate-400 font-medium">Selected Seats:</span>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {seatNames.map((name) => (
            <span
              key={name}
              className="px-2.5 py-1 rounded-lg bg-violet-600/20 border border-violet-500/40 text-violet-300 font-bold text-xs"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 pt-2 text-xs border-t border-slate-800">
        <div className="flex justify-between text-slate-300">
          <span>Ticket Price</span>
          <span className="font-semibold text-white">₹{ticketSubtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-slate-400">
          <span>Convenience Fee (8%)</span>
          <span>₹{convenienceFee.toFixed(2)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between items-center text-emerald-400 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Coupon ({appliedCoupon.code})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
              <button
                onClick={removeCoupon}
                className="text-[10px] uppercase underline text-slate-400 hover:text-white"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-baseline pt-3 border-t border-slate-800 text-sm">
          <span className="font-bold text-white">Total Payable</span>
          <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Safe & Encrypted 256-bit Mock Checkout</span>
      </div>

      {/* Proceed CTA */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isLoading}
        onClick={onProceed}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Proceed to Payment
      </Button>
    </div>
  );
};
