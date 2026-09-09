import React, { useEffect, useState } from 'react';
import { couponApi } from '../services/api.js';
import { Coupon } from '../types/index.js';
import { Badge } from '../components/common/Badge.js';
import { Tag, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';

export const Offers: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await couponApi.getActiveCoupons();
        setCoupons(data);
      } catch (err) {
        console.error('Failed to load coupons', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-1 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive CinePulse Discounts</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Cinema Deals & Offers</h1>
        <p className="text-xs text-slate-400">
          Apply these coupon codes during seat checkout to save on your entertainment bookings.
        </p>
      </div>

      {/* Coupons Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading coupons...</p>
        </div>
      ) : coupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => {
            const isCopied = copiedCode === coupon.code;
            return (
              <div
                key={coupon.id}
                className="relative bg-slate-900 border border-slate-800 hover:border-violet-500/40 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-black text-violet-400 bg-violet-600/10 px-3 py-1 rounded-xl border border-violet-500/30">
                      {coupon.code}
                    </span>
                    <Badge variant="accent" size="sm">
                      {coupon.discountType === 'PERCENTAGE'
                        ? `${coupon.discountValue}% OFF`
                        : `₹${coupon.discountValue} FLAT`}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {coupon.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Min. Order: ₹{coupon.minAmount}</span>
                    {coupon.maxDiscount && <span>Max Discount: ₹{coupon.maxDiscount}</span>}
                  </div>

                  <button
                    onClick={() => handleCopyCode(coupon.code)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-violet-600 text-slate-200 hover:text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Promo Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-2">
          <p className="text-sm font-semibold text-slate-300">No active offers right now.</p>
          <p className="text-xs text-slate-400">Check back later for seasonal festival discounts!</p>
        </div>
      )}
    </div>
  );
};
