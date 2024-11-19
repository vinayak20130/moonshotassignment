import PropTypes from 'prop-types';
import { formatDate } from '../utils/dateFormatter';

const EmailListItem = ({ email, isSelected, isRead, onSelect, isFavorite }) => {
  return (
    <div
      className={`p-4 rounded-lg cursor-pointer transition-all
        ${isRead ? 'bg-read' : 'bg-white'}
        ${isSelected ? 'border-2 border-border' : 'border border-transparent'}
        hover:shadow-md
      `}
      onClick={() => onSelect(email)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(email);
        }
      }}
      aria-selected={isSelected}
    >
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-medium">
          {email.from?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-content">
            From: {email.from?.name} ({email.from?.email})
          </div>
          <div className="text-sm mt-1 font-medium">
            Subject: {email.subject}
          </div>
          <div className="text-sm text-content mt-1 line-clamp-1">
            {email.short_description}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-content">
            <span>{formatDate(email.date)}</span>
            {isFavorite && (
              <span className="text-accent">Favorite</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

EmailListItem.propTypes = {
  email: PropTypes.shape({
    id: PropTypes.string.isRequired,
    from: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    }),
    subject: PropTypes.string,
    short_description: PropTypes.string,
    date: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  isRead: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};