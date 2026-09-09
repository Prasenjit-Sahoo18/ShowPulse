import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Smartphone, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-black text-white text-sm">
                CP
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Cine<span className="text-violet-400">Pulse</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's next-generation entertainment ticketing experience. Book the latest movies, explore IMAX & 4DX cinemas, and enjoy seamless contactless check-ins.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Discover</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/movies" className="hover:text-violet-400 transition-colors">
                  Now Showing Movies
                </Link>
              </li>
              <li>
                <Link to="/movies?status=comingSoon" className="hover:text-violet-400 transition-colors">
                  Upcoming Blockbusters
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-violet-400 transition-colors">
                  Offers & Coupons
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-violet-400 transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Hubs</h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-400">
              <span>Bhubaneswar</span>
              <span>Mumbai</span>
              <span>Delhi-NCR</span>
              <span>Bengaluru</span>
              <span>Hyderabad</span>
              <span>Chennai</span>
              <span>Kolkata</span>
              <span>Pune</span>
            </div>
          </div>

          {/* Col 4: React Native Mobile Experience */}
          <div className="space-y-3 bg-gradient-to-br from-violet-950/40 to-slate-900/60 p-4 rounded-2xl border border-violet-800/30">
            <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs">
              <Smartphone className="w-4 h-4" />
              <span>Mobile-Ready Architecture</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Powered by decoupled REST APIs ready for native iOS & Android consumption via React Native.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Shared Backend</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            © {new Date().getFullYear()} CinePulse Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Built with modern web engineering <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
