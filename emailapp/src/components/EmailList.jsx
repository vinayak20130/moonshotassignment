import PropTypes from 'prop-types';
import EmailListItem from './EmailListItem'

const EmailList = ({ emails, selectedEmail, onEmailSelect, readEmails, favoriteEmails, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse bg-white rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!emails?.length) {
    return (
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <p className="text-gray-500">No emails found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto space-y-4">
      {emails.map((email) => (
        <EmailListItem
          key={email.id}
          email={email}
          isSelected={selectedEmail?.id === email.id}
          isRead={readEmails.includes(email.id)}
          isFavorite={favoriteEmails.includes(email.id)}
          onSelect={onEmailSelect}
        />
      ))}
    </div>
  );
};

EmailList.propTypes = {
  emails: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      from: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
      }),
      subject: PropTypes.string,
      short_description: PropTypes.string,
      date: PropTypes.string,
    })
  ).isRequired,
  selectedEmail: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  onEmailSelect: PropTypes.func.isRequired,
  readEmails: PropTypes.arrayOf(PropTypes.string).isRequired,
  favoriteEmails: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLoading: PropTypes.bool,
};

EmailList.defaultProps = {
  selectedEmail: null,
  isLoading: false,
};

export default EmailList;