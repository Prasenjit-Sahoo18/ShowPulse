import React, { createContext, useContext, useState } from 'react';
import { Coupon, Show, ShowSeatItem } from '../types/index.js';
import { couponApi } from '../services/api.js';

interface BookingContextType {
  activeShow: Show | null;
  setActiveShow: (show: Show | null) => void;
  selectedSeats: ShowSeatItem[];
  toggleSeat: (seat: ShowSeatItem) => void;
  clearSeats: () => void;
  appliedCoupon: { code: string; discount: number; finalAmount: number } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  ticketSubtotal: number;
  convenienceFee: number;
  discountAmount: number;
  grandTotal: number;
  seatNames: string[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeShow, setActiveShow] = useState<Show | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<ShowSeatItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    finalAmount: number;
  } | null>(null);

  const toggleSeat = (seat: ShowSeatItem) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.seatId === seat.seatId);
      if (exists) {
        return prev.filter((s) => s.seatId !== seat.seatId);
      }
      if (prev.length >= 10) {
        alert('You can select a maximum of 10 tickets per transaction.');
        return prev;
      }
      return [...prev, seat];
    });
  };

  const clearSeats = () => {
    setSelectedSeats([]);
    setAppliedCoupon(null);
  };

  const ticketSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? Math.round((ticketSubtotal * 8) / 100) : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, ticketSubtotal + convenienceFee - discountAmount);

  const applyCoupon = async (code: string) => {
    try {
      const result = await couponApi.validateCoupon(code, ticketSubtotal);
      setAppliedCoupon({
        code: result.code,
        discount: result.discount,
        finalAmount: result.finalAmount,
      });
      return { success: true, message: `Coupon ${result.code} applied! Saved ₹${result.discount}` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Invalid coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const seatNames = selectedSeats.map((s) => `${s.row}${s.number}`);

  return (
    <BookingContext.Provider
      value={{
        activeShow,
        setActiveShow,
        selectedSeats,
        toggleSeat,
        clearSeats,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        ticketSubtotal,
        convenienceFee,
        discountAmount,
        grandTotal,
        seatNames,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a BookingProvider');
  return context;
};
