import React from 'react';

type Source = { id: string; name: string; thumbnail?: string };

export const ScreenPickerModal: React.FC<{
  sources: Source[];
  onPick: (sourceId: string) => void;
  onClose: () => void;
}> = ({ sources, onPick, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 rounded p-4 w-[720px] max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Pick a screen or window</h2>
          <button className="text-slate-300" onClick={onClose}>✕</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {sources.map((s) => (
            <button key={s.id} className="bg-slate-800 border border-slate-700 rounded overflow-hidden text-left" onClick={() => onPick(s.id)}>
              {s.thumbnail ? (
                <img src={s.thumbnail} alt={s.name} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-slate-700" />
              )}
              <div className="p-2 text-sm truncate">{s.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 