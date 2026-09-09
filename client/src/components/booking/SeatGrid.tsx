import React from 'react';
import { ShowSeatItem } from '../../types/index.js';

interface SeatGridProps {
  seats: ShowSeatItem[];
  selectedSeatIds: string[];
  onSeatClick: (seat: ShowSeatItem) => void;
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  selectedSeatIds,
  onSeatClick,
}) => {
  // Group seats by row
  const rowMap: { [row: string]: ShowSeatItem[] } = {};
  seats.forEach((seat) => {
    if (!rowMap[seat.row]) rowMap[seat.row] = [];
    rowMap[seat.row].push(seat);
  });

  // Sort rows alphabetically
  const rows = Object.keys(rowMap).sort();

  return (
    <div className="w-full flex flex-col items-center py-6 select-none overflow-x-auto">
      {/* Cinema Screen Curved Projection */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
        <div className="relative w-full h-8 overflow-hidden">
          <svg
            viewBox="0 0 500 50"
            className="w-full h-full text-violet-500/40 drop-shadow-[0_4px_16px_rgba(139,92,246,0.3)]"
          >
            <path
              d="M 20 40 Q 250 10 480 40"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1 flex items-center gap-2">
          <span>Cinema Screen Projection</span>
        </div>
      </div>

      {/* Seat Rows Matrix */}
      <div className="space-y-3 min-w-max pb-6">
        {rows.map((rowLetter) => {
          const rowSeats = rowMap[rowLetter].sort((a, b) => a.number - b.number);
          const firstSeat = rowSeats[0];
          const seatType = firstSeat?.seatType || 'NORMAL';
          const price = firstSeat?.price || 0;

          // Determine category label color
          const typeBadgeColor =
            seatType === 'RECLINER'
              ? 'text-amber-400 border-amber-400/30 bg-amber-400/10'
              : seatType === 'PREMIUM'
              ? 'text-violet-400 border-violet-400/30 bg-violet-400/10'
              : seatType === 'EXECUTIVE'
              ? 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10'
              : 'text-slate-400 border-slate-700 bg-slate-800/40';

          return (
            <div key={rowLetter} className="flex items-center gap-3">
              {/* Row Label & Type */}
              <div className="w-24 flex items-center justify-between pr-2">
                <span className="text-xs font-bold text-slate-300 w-4 text-center">{rowLetter}</span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${typeBadgeColor}`}>
                  ₹{price}
                </span>
              </div>

              {/* Seats in this row */}
              <div className="flex items-center gap-2">
                {rowSeats.map((seat, index) => {
                  const isSelected = selectedSeatIds.includes(seat.seatId);
                  const isBooked = seat.status === 'BOOKED';
                  const isLocked = seat.status === 'LOCKED' && !isSelected;

                  let seatStyle =
                    'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:border-violet-400 cursor-pointer';

                  if (isBooked) {
                    seatStyle = 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-30';
                  } else if (isLocked) {
                    seatStyle = 'bg-amber-950/60 border-amber-600/60 text-amber-300 cursor-not-allowed';
                  } else if (isSelected) {
                    seatStyle =
                      'bg-gradient-to-tr from-violet-600 to-fuchsia-600 border-violet-300 text-white font-bold shadow-lg shadow-violet-600/50 scale-105';
                  } else if (seat.seatType === 'RECLINER') {
                    seatStyle =
                      'bg-amber-950/20 border-amber-500/50 text-amber-200 hover:bg-amber-900/40 hover:border-amber-400 cursor-pointer';
                  }

                  // Add middle aisle space after seat 5 or 4
                  const addAisle = index === Math.floor(rowSeats.length / 2) - 1;

                  return (
                    <React.Fragment key={seat.seatId}>
                      <button
                        type="button"
                        disabled={isBooked || isLocked}
                        onClick={() => onSeatClick(seat)}
                        title={`${seat.row}${seat.number} - ${seat.seatType} (₹${seat.price})`}
                        className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center border transition-all duration-150 ${seatStyle}`}
                      >
                        {seat.number}
                      </button>
                      {addAisle && <div className="w-6" />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Right Row Label */}
              <span className="text-xs font-bold text-slate-400 w-4 text-center pl-2">{rowLetter}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
