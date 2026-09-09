import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useBooking } from '../context/BookingContext.js';
import { bookingApi } from '../services/api.js';
import { Button } from '../components/common/Button.js';
import { PaymentMethod } from '../types/index.js';
import {
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  Tag,
  ShieldCheck,
  Film,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedSeats,
    seatNames,
    ticketSubtotal,
    convenienceFee,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    grandTotal,
  } = useBooking();

  const stateData = location.state as any;
  const showInfo = stateData?.showInfo;
  const showId = stateData?.showId;

  // Coupon code input state
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Payment method selection
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8900 1234 5678');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  if (!showInfo || selectedSeats.length === 0) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">No Active Checkout Session</h2>
        <p className="text-xs text-slate-400">Please select movie showtime and seats first.</p>
        <Button variant="primary" size="md" onClick={() => navigate('/movies')}>
          Browse Movies
        </Button>
      </div>
    );
  }

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    setCouponFeedback(null);
    const res = await applyCoupon(couponInput.trim());
    setCouponFeedback(res);
    setIsApplyingCoupon(false);
  };

  const handleConfirmPayment = async () => {
    setPaymentError('');

    if (simulateFailure) {
      setPaymentError('Mock Payment Declined: Bank server rejected transaction (Simulated Failure Mode). You can uncheck failure simulation to retry.');
      return;
    }

    setIsProcessing(true);

    try {
      const seatIds = selectedSeats.map((s) => s.seatId);
      const booking = await bookingApi.createBooking({
        showId,
        seatIds,
        paymentMethod: selectedMethod,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      });

      // Navigate to Booking Confirmation page
      navigate(`/booking-confirmed/${booking.id}`, { state: { booking } });
    } catch (err: any) {
      console.error('Booking failed', err);
      setPaymentError(err.message || 'Payment confirmation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-white tracking-tight">Checkout & Payment</h1>
        <p className="text-xs text-slate-400">
          Review your cinema tickets and complete your mock payment securely.
        </p>
      </div>

      {paymentError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-300 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{paymentError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Col: Payment Method Selection (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Payment Method Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white">Choose Payment Method</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: <QrCode className="w-4 h-4" /> },
                { id: 'CREDIT_CARD', label: 'Credit Card', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'DEBIT_CARD', label: 'Debit Card', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'NET_BANKING', label: 'Net Banking', icon: <Building2 className="w-4 h-4" /> },
              ].map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300 ring-1 ring-violet-500 shadow-md shadow-violet-600/20'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="mb-1.5">{method.icon}</div>
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Payment Details Input */}
            <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl space-y-3">
              {selectedMethod === 'UPI' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Enter UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
                    placeholder="username@okhdfcbank"
                  />
                  <p className="text-[11px] text-slate-400">
                    Supports Google Pay, PhonePe, Paytm, BHIM, and bank UPI apps.
                  </p>
                </div>
              )}

              {(selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD') && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                        maxLength={4}
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'NET_BANKING' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Choose Popular Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Test Simulation Controls */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="simFail"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-rose-500"
                />
                <label htmlFor="simFail" className="text-xs text-slate-400 cursor-pointer">
                  Simulate Bank Payment Failure (Test Mode)
                </label>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Sandbox Active</span>
            </div>
          </div>

          {/* Coupon Redemption Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-violet-400" />
              <span>Apply Discount Coupon</span>
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Coupon {appliedCoupon.code} applied! Saved ₹{appliedCoupon.discount}</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME50, MOVIE100"
                  className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 uppercase font-mono tracking-wider focus:outline-none focus:border-violet-500"
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  isLoading={isApplyingCoupon}
                >
                  Apply
                </Button>
              </form>
            )}

            {couponFeedback && !appliedCoupon && (
              <div
                className={`text-xs font-medium ${
                  couponFeedback.success ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {couponFeedback.message}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Ticket & Price Summary (1 col) */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="space-y-2 pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">{showInfo.movie?.title}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <span>{showInfo.theatre?.name}</span>
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {new Date(showInfo.date).toLocaleDateString()} • {showInfo.startTime}
                </span>
              </p>
            </div>

            {/* Seats */}
            <div className="space-y-1 text-xs">
              <span className="text-slate-400 font-medium">Selected Seats:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {seatNames.map((name) => (
                  <span
                    key={name}
                    className="px-2 py-0.5 rounded-md bg-violet-600/20 text-violet-300 font-bold border border-violet-500/30"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs pt-3 border-t border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal ({selectedSeats.length} Tickets)</span>
                <span className="font-semibold text-white">₹{ticketSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Convenience Fee (8%)</span>
                <span>₹{convenienceFee.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-₹{appliedCoupon.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-3 border-t border-slate-800 text-sm">
                <span className="font-bold text-white">Total Amount</span>
                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Pay Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isProcessing}
              onClick={handleConfirmPayment}
            >
              Pay ₹{grandTotal.toFixed(2)} & Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
