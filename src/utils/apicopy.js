import axios from 'axios';
import store from '../redux/store';
import { LOGOUT } from '../redux/types';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests and add token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Intercept responses and handle errors
api.interceptors.response.use(
  response => response,
  error => {
    // If unauthorized, log the user out
    if (error.response && error.response.status === 401) {
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(error);
  }
);

// Auth API calls - connecting to real backend
export const loginUser = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const registerUser = (userData) => {
  return api.post('/auth/register', userData);
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};

export const updateUserProfile = (userData) => {
  return api.put('/users/profile', userData);
};

export const getRoleConfig = () => {
  return api.get('/auth/role-config');
};

// For development/testing purposes - mock API functions
// Use these when backend is not available
const mockApiCall = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

// Mock Auth API calls
export const mockLoginUser = (email, password) => {
  // Mock response for login
  const mockResponse = {
    token: 'mock-jwt-token-for-testing',
    user: {
      _id: '123456789',
      name: 'John Doe',
      email: email,
      role: 'user',
      profileImage: 'https://via.placeholder.com/150'
    }
  };
  return mockApiCall(mockResponse);
};

export const mockRegisterUser = (userData) => {
  // Mock response for register
  const mockResponse = {
    token: 'mock-jwt-token-for-testing',
    user: {
      _id: '123456789',
      name: userData.name,
      email: userData.email,
      role: 'user',
      profileImage: 'https://via.placeholder.com/150'
    }
  };
  return mockApiCall(mockResponse);
};

export const mockGetCurrentUser = () => {
  // Mock response for getting current user
  const storedUser = localStorage.getItem('user');
  const mockUser = storedUser ? JSON.parse(storedUser) : {
    _id: '123456789',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    profileImage: 'https://via.placeholder.com/150'
  };
  
  return mockApiCall({ user: mockUser });
};

export const mockUpdateUserProfile = (userData) => {
  // Get current user from localStorage
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : {};
  
  // Create updated user object
  const updatedUser = { ...currentUser, ...userData };
  
  // If userData is FormData, handle differently
  if (userData instanceof FormData) {
    const name = userData.get('name');
    const email = userData.get('email');
    
    if (name) updatedUser.name = name;
    if (email) updatedUser.email = email;
    
    // Handle profile image
    if (userData.get('profileImage')) {
      // In a real app, this would be the URL returned from the server
      // For now, we'll use a placeholder
      updatedUser.profileImage = 'https://via.placeholder.com/150';
    }
  }
  
  return mockApiCall(updatedUser);
};

// Package API calls
export const getPackages = () => {
  // Mock response for packages
  const packages = [
    {
      _id: 'pkg1',
      title: 'Swat Valley Adventure',
      description: 'Experience the beauty of Swat Valley',
      price: 45000,
      duration: '5 days',
      location: 'Swat Valley, Pakistan',
      image: 'https://source.unsplash.com/random/800x600/?swat,valley'
    },
    {
      _id: 'pkg2',
      title: 'Kashmir Paradise Tour',
      description: 'Explore the paradise on earth',
      price: 65000,
      duration: '7 days',
      location: 'Kashmir, Pakistan',
      image: 'https://source.unsplash.com/random/800x600/?kashmir'
    }
  ];
  return mockApiCall({ packages });
  // When ready for real API: return api.get('/packages');
};

export const getPackage = (id) => {
  // Mock response for single package
  const packageData = {
    _id: id,
    title: id === 'pkg1' ? 'Swat Valley Adventure' : 'Kashmir Paradise Tour',
    description: id === 'pkg1' 
      ? 'Experience the beauty of Swat Valley with this amazing tour package.' 
      : 'Explore the paradise on earth with our comprehensive Kashmir tour.',
    price: id === 'pkg1' ? 45000 : 65000,
    duration: id === 'pkg1' ? '5 days' : '7 days',
    location: id === 'pkg1' ? 'Swat Valley, Pakistan' : 'Kashmir, Pakistan',
    image: id === 'pkg1' 
      ? 'https://source.unsplash.com/random/800x400/?swat,valley' 
      : 'https://source.unsplash.com/random/800x400/?kashmir',
    includes: [
      'Hotel accommodation',
      'Breakfast and dinner',
      'Transportation',
      'Tour guide',
      'Sightseeing activities'
    ],
    itinerary: [
      { day: 1, title: 'Arrival', description: 'Arrive at the destination and check-in to hotel.' },
      { day: 2, title: 'Exploration', description: 'Explore local attractions and scenic spots.' },
      { day: 3, title: 'Adventure', description: 'Participate in adventure activities.' }
    ]
  };
  return mockApiCall({ package: packageData });
  // When ready for real API: return api.get(`/packages/${id}`);
};

export const createBooking = (bookingData) => {
  // Mock response for booking creation
  const newBooking = {
    _id: `bk-${Date.now()}`,
    ...bookingData,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: new Date().toISOString()
  };
  return mockApiCall({ booking: newBooking });
  // When ready for real API: return api.post('/bookings', bookingData);
};

export const getUserBookings = () => {
  // Mock response for user bookings
  const bookings = [
    {
      _id: 'BK-2025-001',
      packageName: 'Swat Valley Adventure',
      packageImage: 'https://source.unsplash.com/random/300x200/?swat,valley',
      bookingDate: '2025-04-15',
      startDate: '2025-06-10',
      endDate: '2025-06-15',
      totalAmount: 45000,
      status: 'confirmed',
      paymentStatus: 'paid',
      persons: 2
    },
    {
      _id: 'BK-2025-002',
      packageName: 'Kashmir Paradise Tour',
      packageImage: 'https://source.unsplash.com/random/300x200/?kashmir',
      bookingDate: '2025-03-20',
      startDate: '2025-07-05',
      endDate: '2025-07-12',
      totalAmount: 65000,
      status: 'pending',
      paymentStatus: 'partial',
      persons: 3
    }
  ];
  return mockApiCall({ bookings });
  // When ready for real API: return api.get('/bookings/user');
};

export const getBookingDetails = (id) => {
  // Mock response for booking details
  const booking = {
    _id: id,
    packageName: id === 'BK-2025-001' ? 'Swat Valley Adventure' : 'Kashmir Paradise Tour',
    packageImage: id === 'BK-2025-001' 
      ? 'https://source.unsplash.com/random/800x400/?swat,valley' 
      : 'https://source.unsplash.com/random/800x400/?kashmir',
    bookingDate: id === 'BK-2025-001' ? '2025-04-15' : '2025-03-20',
    startDate: id === 'BK-2025-001' ? '2025-06-10' : '2025-07-05',
    endDate: id === 'BK-2025-001' ? '2025-06-15' : '2025-07-12',
    totalAmount: id === 'BK-2025-001' ? 45000 : 65000,
    status: id === 'BK-2025-001' ? 'confirmed' : 'pending',
    paymentStatus: id === 'BK-2025-001' ? 'paid' : 'partial',
    persons: id === 'BK-2025-001' ? 2 : 3,
    packageDetails: {
      duration: id === 'BK-2025-001' ? '5 days, 4 nights' : '7 days, 6 nights',
      location: id === 'BK-2025-001' ? 'Swat Valley, Pakistan' : 'Kashmir, Pakistan',
      includes: [
        'Hotel accommodation', 
        'Breakfast and dinner', 
        'Transportation', 
        'Tour guide', 
        'Sightseeing activities'
      ]
    }
  };
  return mockApiCall({ booking });
  // When ready for real API: return api.get(`/bookings/${id}`);
};

// Review API calls
export const createReview = (reviewData) => {
  // Mock response for review creation
  const newReview = {
    _id: `rev-${Date.now()}`,
    ...reviewData,
    createdAt: new Date().toISOString()
  };
  return mockApiCall({ review: newReview });
  // When ready for real API: return api.post('/reviews', reviewData);
};

export const getReviews = () => {
  // Mock response for reviews
  const reviews = [
    {
      _id: 'rev1',
      packageId: 'pkg1',
      userId: 'user1',
      userName: 'John Doe',
      rating: 5,
      comment: 'Amazing experience! Would definitely recommend.',
      createdAt: '2025-03-15T10:30:00Z'
    },
    {
      _id: 'rev2',
      packageId: 'pkg2',
      userId: 'user2',
      userName: 'Jane Smith',
      rating: 4,
      comment: 'Great tour package, but the food could be better.',
      createdAt: '2025-03-10T14:45:00Z'
    }
  ];
  return mockApiCall({ reviews });
  // When ready for real API: return api.get('/reviews');
};

export default api;
