import React from 'react';

/**
 * Small pill shown next to any UI section that is filled with static/demo data
 * because it has no backend yet. See src/utils/staticData.js for the source.
 */
const DemoBadge = ({ className = '', label = 'Demo' }) => (
  <span
    title="Static demo data — no backend endpoint yet"
    className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded ${className}`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
    {label}
  </span>
);

export default DemoBadge;
