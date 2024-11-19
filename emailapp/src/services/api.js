const BASE_URL = 'https://flipkart-email-mock.now.sh';

export const fetchEmails = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}${page > 1 ? `/?page=${page}` : ''}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching emails:', error);
    return { list: [] };
  }
};

export const fetchEmailBody = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/?id=${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching email body:', error);
    return null;
  }
};
