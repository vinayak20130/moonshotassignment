// src/utils/dateFormatter.js
export const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      
      return new Intl.DateTimeFormat('en-US', options).format(date)
        .replace(',', '')
        .toLowerCase()
        .replace('pm', 'p.m.')
        .replace('am', 'a.m.');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

