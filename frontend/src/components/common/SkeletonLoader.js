import React from 'react';

const SkeletonLoader = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          {[...Array(columns)].map((_, j) => (
            <div
              key={j}
              className="h-12 bg-gray-200 rounded skeleton flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="h-4 bg-gray-200 rounded skeleton w-1/3 mb-4" />
    <div className="h-8 bg-gray-200 rounded skeleton w-1/2 mb-2" />
    <div className="h-3 bg-gray-200 rounded skeleton w-1/4" />
  </div>
);

export default SkeletonLoader;
