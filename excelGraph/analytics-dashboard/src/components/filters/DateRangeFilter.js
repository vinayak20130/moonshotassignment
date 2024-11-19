import React from 'react';
import DatePicker from 'react-datepicker';
import { parse, format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

const DateRangeFilter = ({ startDate, endDate, onChange }) => {
  const parseDate = (dateString) => {
    if (!dateString) return null;

    if (dateString.includes('/')) {
      return parse(dateString, 'dd/MM/yyyy', new Date());
    }
    return new Date(dateString);
  };

  const formatDateForApi = (date) => {
    if (!date) return null;
    return format(date, 'dd/MM/yyyy');
  };

  const handleStartDateChange = (date) => {
    onChange({
      start: date ? formatDateForApi(date) : null,
      end: endDate
    });
  };

  const handleEndDateChange = (date) => {
    onChange({
      start: startDate,
      end: date ? formatDateForApi(date) : null
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <DatePicker
          selected={parseDate(startDate)}
          onChange={handleStartDateChange}
          selectsStart
          startDate={parseDate(startDate)}
          endDate={parseDate(endDate)}
          dateFormat="dd/MM/yyyy"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <DatePicker
          selected={parseDate(endDate)}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={parseDate(startDate)}
          endDate={parseDate(endDate)}
          minDate={parseDate(startDate)}
          dateFormat="dd/MM/yyyy"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;