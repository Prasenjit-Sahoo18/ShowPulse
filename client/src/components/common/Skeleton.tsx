import React from 'react';

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 animate-pulse">
      <div className="w-full aspect-[2/3] bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-slate-800 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-4 bg-slate-800 rounded w-16" />
          <div className="h-4 bg-slate-800 rounded w-12" />
        </div>
        <div className="h-4 bg-slate-800 rounded w-1/2" />
        <div className="h-9 bg-slate-800 rounded-xl mt-2" />
      </div>
    </div>
  );
};

export const SeatGridSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse max-w-2xl mx-auto py-12">
      <div className="h-10 bg-slate-800 rounded-full w-3/4 mx-auto" />
      <div className="grid grid-cols-10 gap-2 pt-8">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="w-8 h-8 bg-slate-800/80 rounded-lg mx-auto" />
        ))}
      </div>
    </div>
  );
};
