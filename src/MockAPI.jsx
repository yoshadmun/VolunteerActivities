import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Fetch volunteers with optional search, pagination, and pageSize
export const fetchVolunteers = async (search = '', page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${API_URL}/volunteers`, {
      params: { search, page, pageSize }
    });
    return {
      data: response.data.volunteers,
      total: response.data.total,
    };
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return { data: [], total: 0 };
  }
};

// Fetch matched events based on search criteria
export const fetchMatchedEvents = async (search = [], page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${API_URL}/events`, {
      params: { search, page, pageSize }
    });
    return {
      data: response.data.events,
      total: response.data.total,
    };
  } catch (error) {
    console.error('Error fetching matched events:', error);
    return { data: [], total: 0 };
  }
};

// Fetch events with optional search, pagination, and pageSize
export const fetchEvents = async (search = '', page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${API_URL}/events`, {
      params: { search, page, pageSize }
    });
    return {
      data: response.data.events,
      total: response.data.total,
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { data: [], total: 0 };
  }
};
