import React from 'react';

const FilterOption = ({ label, value, options, onChange }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const FilterPanel = ({ filters, onFilterChange }) => {
  const ageRangeOptions = [
    { value: '15-25', label: '15-25 years' },
    { value: '>25', label: 'Over 25 years' }
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  return (
    <div className="space-y-4">
      <FilterOption
        label="Age Range"
        value={filters.ageRange}
        options={ageRangeOptions}
        onChange={(value) => onFilterChange({ ageRange: value })}
      />
      
      <FilterOption
        label="Gender"
        value={filters.gender}
        options={genderOptions}
        onChange={(value) => onFilterChange({ gender: value })}
      />
    </div>
  );
};

export default FilterPanel;