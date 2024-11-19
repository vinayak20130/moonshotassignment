// App.jsx
import { useState, useEffect } from 'react';
import { fetchEmails, fetchEmailBody } from './services/api';
import EmailList from './components/EmailList';
import EmailBody from './components/EmailBody';

const App = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailBody, setEmailBody] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [readEmails, setReadEmails] = useState(() => {
    const saved = localStorage.getItem('readEmails');
    return saved ? JSON.parse(saved) : [];
  });
  const [favoriteEmails, setFavoriteEmails] = useState(() => {
    const saved = localStorage.getItem('favoriteEmails');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadEmails = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEmails(page);
        setEmails(data.list || []);
      } catch (error) {
        console.error('Error loading emails:', error);
       
      } finally {
        setIsLoading(false);
      }
    };

    loadEmails();
  }, [page]);

  useEffect(() => {
    localStorage.setItem('readEmails', JSON.stringify(readEmails));
  }, [readEmails]);

  useEffect(() => {
    localStorage.setItem('favoriteEmails', JSON.stringify(favoriteEmails));
  }, [favoriteEmails]);

  const handleEmailSelect = async (email) => {
    setSelectedEmail(email);
    if (!readEmails.includes(email.id)) {
      setReadEmails([...readEmails, email.id]);
    }

    try {
      const bodyData = await fetchEmailBody(email.id);
      
      setEmailBody({
        ...email,
        body: bodyData.body, 
      });
    } catch (error) {
      console.error('Error loading email body:', error);
    }
  };

  const handleFavorite = (emailId) => {
    setFavoriteEmails((prev) => {
      if (prev.includes(emailId)) {
        return prev.filter((id) => id !== emailId);
      }
      return [...prev, emailId];
    });
  };

  const filteredEmails = emails.filter((email) => {
    switch (filter) {
      case 'unread':
        return !readEmails.includes(email.id);
      case 'read':
        return readEmails.includes(email.id);
      case 'favorites':
        return favoriteEmails.includes(email.id);
      default:
        return true;
    }
  });
  useEffect(() => {
    const loadEmails = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEmails(page);
        if (data.list && data.list.length === 0 && page > 1) {
  
          setPage(page - 1);
          return;
        }
        setEmails(data.list || []);
      } catch (error) {
        console.error('Error loading emails:', error);

      } finally {
        setIsLoading(false);
      }
    };

    loadEmails();
  }, [page]);
  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="bg-white p-4 flex-shrink-0 border-b border-border">
        <div className="mx-auto">
          <div className="mt-2 space-x-4">
            <span className="text-content">Filter By:</span>
            <button
              className={`px-4 py-2 rounded-full transition-colors duration-200 
                  ${
                    filter === 'unread'
                      ? 'bg-filter text-content'
                      : 'text-content hover:bg-filter/50'
                  }`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-colors duration-200 
                  ${
                    filter === 'read'
                      ? 'bg-filter text-content'
                      : 'text-content hover:bg-filter/50'
                  }`}
              onClick={() => setFilter('read')}
            >
              Read
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-colors duration-200 
                  ${
                    filter === 'favorites'
                      ? 'bg-filter text-content'
                      : 'text-content hover:bg-filter/50'
                  }`}
              onClick={() => setFilter('favorites')}
            >
              Favorites
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden p-4 mx-auto w-full">
        <div
          className={`${
            selectedEmail ? 'w-2/5' : 'w-full'
          } flex flex-col space-y-4`}
        >
          <EmailList
            emails={filteredEmails}
            selectedEmail={selectedEmail}
            onEmailSelect={handleEmailSelect}
            readEmails={readEmails}
            favoriteEmails={favoriteEmails}
            isLoading={isLoading}
          />

          <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Page {page}</div>
            <div className="space-x-2">
              <button
                className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1 || isLoading}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setPage(page + 1)}
                disabled={filteredEmails.length === 0 || isLoading}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {selectedEmail && (
          <div className="w-3/5 flex flex-col pl-4">
            <EmailBody
              email={emailBody}
              onFavorite={handleFavorite}
              isFavorite={favoriteEmails.includes(selectedEmail.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
