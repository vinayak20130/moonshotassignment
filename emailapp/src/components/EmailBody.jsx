import PropTypes from 'prop-types';
import { formatDate } from '../utils/dateFormatter';

const EmailBody = ({ email, onFavorite, isFavorite }) => {
  if (!email) {
    return (
      <div className="bg-white rounded-lg p-6 flex items-center justify-center h-full">
        <p className="text-content">Select an email to view its contents</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg flex-1 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-medium">
              {email.from?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-content">{email.subject}</h2>
              <div className="text-content">{formatDate(email.date)}</div>
            </div>
          </div>
          <button
            onClick={() => onFavorite(email.id)}
            className={`px-4 py-2 rounded-full transition-colors duration-200
              ${isFavorite 
                ? 'bg-accent text-white' 
                : 'bg-filter text-content hover:bg-filter/75'
              }`}
          >
            {isFavorite ? 'Favorited' : 'Mark as favorite'}
          </button>
        </div>
        <div 
          className="prose max-w-none text-content"
          dangerouslySetInnerHTML={{ __html: email.body }}
        />
      </div>
    </div>
  );
};

EmailBody.propTypes = {
  email: PropTypes.shape({
    id: PropTypes.string.isRequired,
    subject: PropTypes.string,
    body: PropTypes.string,
    date: PropTypes.string,
    from: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  }),
  onFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};

EmailBody.defaultProps = {
  email: null,
};

export default EmailBody;