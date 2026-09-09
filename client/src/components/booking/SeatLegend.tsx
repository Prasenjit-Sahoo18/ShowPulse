import React from 'react';

export const SeatLegend: React.FC = () => {
  const legendItems = [
    { label: 'Available', color: 'bg-slate-800 border-slate-700 text-slate-300' },
    { label: 'Selected', color: 'bg-gradient-to-tr from-violet-600 to-fuchsia-600 border-violet-400 text-white shadow-md shadow-violet-600/40' },
    { label: 'Booked', color: 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-40' },
    { label: 'Recliner (₹400-₹450)', color: 'border-amber-400/80 bg-amber-400/10 text-amber-300' },
    { label: 'Premium (₹300-₹320)', color: 'border-violet-400/80 bg-violet-400/10 text-violet-300' },
    { label: 'Executive (₹220-₹250)', color: 'border-cyan-400/80 bg-cyan-400/10 text-cyan-300' },
    { label: 'Normal (₹160-₹180)', color: 'border-slate-500 bg-slate-800/60 text-slate-400' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4 px-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs font-medium">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-md border ${item.color} shrink-0`} />
          <span className="text-slate-300">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
