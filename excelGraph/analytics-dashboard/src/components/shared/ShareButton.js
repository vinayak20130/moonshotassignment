import React, { useState } from 'react';
import { Link } from 'lucide-react';
import toast from 'react-hot-toast';

const ShareButton = ({ filters }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    const queryParams = new URLSearchParams({
      ageRange: filters.ageRange,
      gender: filters.gender,
      startDate: filters.dateRange.start,
      endDate: filters.dateRange.end,
    }).toString();

    return `${baseUrl}/dashboard?${queryParams}`;
  };

  const handleShare = async () => {
    const link = generateShareableLink();

    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 ease-in-out"
      >
        <Link className="w-4 h-4 mr-2" />
        Share Chart
      </button>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded shadow-lg whitespace-nowrap">
          Click to copy shareable link
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
