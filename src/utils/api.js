import axios from "axios";
import store from "../redux/store";
import { LOGOUT } from "../redux/types";

// Create an axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests and add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses and handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired (session expired), log the user out
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data?.error === "jwt expired"
    ) {
      store.dispatch({ type: LOGOUT });
      // Optionally, show a session expired message (if you use a notification system)
      // window.location.href = '/login?session=expired';
    }
    // If unauthorized (other cases), log the user out
    // if (error.response && error.response.status === 401) {
    //   store.dispatch({ type: LOGOUT });
    // }
    return Promise.reject(error);
  }
);

// Auth API calls - connecting to real backend
export const loginUser = (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const loginAdmin = (email, password) => {
  return api.post("/auth/admin/login", { email, password });
};

export const registerUser = (userData) => {
  return api.post("/auth/register", userData);
};

export const getCurrentUser = () => {
  return api.get("/auth/me");
};

export const updateUserProfile = (userData) => {
  return api.put("/auth/updateprofile", userData);
};

export const updateUserPhoto = (photoData) => {
  const formData = new FormData();
  formData.append("profileImage", photoData);

  // Set the correct headers for file upload
  return api.put("/auth/updatephoto", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const changeUserPassword = (passwordData) => {
  return api.post("/auth/changepassword", passwordData);
};

// Password Reset API functions
export const forgotPassword = (email) => {
  return api.post("/auth/forgotpassword", { email });
};

export const resetPassword = (token, password) => {
  return api.put(`/auth/resetpassword/${token}`, { password });
};

export const getRoleConfig = () => {
  return api.get("/auth/role-config");
};

// Package API calls - connecting to real backend
export const getPackages = () => {
  return api.get("/packages");
};

export const getPackage = (id) => {
  return api.get(`/packages/${id}`);
};

// Admin Package API calls
export const getAdminPackages = async (page = 1, limit = 10) => {
  try {
    const response = await api.get("/packages/admin/all", {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPackage = async (packageData) => {
  try {
    const response = await api.post("/packages", packageData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePackage = async (id, packageData) => {
  try {
    const response = await api.put(`/packages/${id}`, packageData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deletePackage = async (id) => {
  try {
    const response = await api.delete(`/packages/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const enablePackage = async (id) => {
  try {
    const response = await api.put(`/packages/${id}/enable`, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const disablePackage = async (id) => {
  try {
    const response = await api.put(`/packages/${id}/disable`, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadPackageImage = async (id, imageData) => {
  try {
    const response = await api.put(`/packages/${id}/image`, imageData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const uploadPackageImages = async (id, imagesData) => {
  try {
    const response = await api.put(`/packages/${id}/images`, imagesData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

// Direct API functions for use without Redux
export const fetchPackagesDirectly = async () => {
  try {
    const response = await api.get("/packages");
    return response.data;
  } catch (error) {
    return {
      error: error.response?.data?.message || "Failed to fetch packages",
    };
  }
};

export const fetchPackageByIdDirectly = async (id) => {
  try {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  } catch (error) {
    return {
      error: error.response?.data?.message || "Failed to fetch package details",
    };
  }
};

// Booking API functions
export const getUserBookings = async () => {
  try {
    const response = await api.get("/auth/bookings");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/auth/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a booking and payment intent
export const createBookingPaymentIntent = async (bookingData) => {
  try {
    const response = await api.post(
      "/payments/create-payment-intent",
      bookingData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create payment intent"
    );
  }
};

// Confirm payment after successful Stripe payment
export const confirmPayment = async (paymentData) => {
  try {
    const response = await api.post("/payments/confirm", paymentData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to confirm payment"
    );
  }
};

// Get booking details
export const getBookingDetails = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch booking details"
    );
  }
};

// Booking API calls
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post("/api/bookings", bookingData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create booking"
    );
  }
};

// Admin Booking API functions
export const getAllBookingsAdmin = async (page = 1, limit = 10) => {
  try {
    const response = await api.get("/bookings/admin/all", {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.put(
      `/bookings/${bookingId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Review API calls
export const getPackageReviews = (packageId) => {
  return api.get(`/reviews/package/${packageId}`);
};

export const getUserReviews = () => {
  return api.get(`/reviews/user`);
};

export const checkUserReviewedPackage = (packageId) => {
  return api.get(`/reviews/user/check/${packageId}`);
};

export const submitReview = (reviewData) => {
  return api.post(`/reviews`, reviewData);
};

// Admin Review API functions
export const getAllReviewsAdmin = async (page = 1, limit = 10) => {
  try {
    const response = await api.get("/reviews/admin", {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const approveReview = async (reviewId, approved) => {
  try {
    const response = await api.put(`/reviews/${reviewId}/approve`, {
      approved,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Contact API functions
export const submitContact = async (contactData) => {
  try {
    const response = await api.post("/contact", contactData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserContacts = async () => {
  try {
    const response = await api.get("/contact/user");
    return response?.data;
  } catch (error) {
    throw error;
  }
};

// Admin Contact API functions
export const getAllContactsAdmin = async (status) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get("/contact", {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const replyToContact = async (contactId, text) => {
  try {
    const response = await api.put(`/contact/${contactId}/reply`, { text });
    return response;
  } catch (error) {
    throw error;
  }
};

// Admin Payment API functions
export const getStripeBalance = async () => {
  try {
    const response = await api.get("/payments/stripe/balance", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTransactions = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/payments/stripe/transactions?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTransactionById = async (transactionId) => {
  try {
    const response = await api.get(
      `/payments/stripe/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllAdminPayments = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/payments/admin/all?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePaymentStatus = async (paymentId, status) => {
  try {
    const response = await api.put(
      `/payments/${paymentId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Dashboard API functions
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookingChartData = async () => {
  try {
    const response = await api.get("/dashboard/booking-chart", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRevenueChartData = async () => {
  try {
    const response = await api.get("/dashboard/revenue-chart", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecentActivity = async () => {
  try {
    const response = await api.get("/dashboard/recent-activity", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin User Management API functions
export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/users?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.put(
      `/users/${userId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Site Settings API functions
export const getSiteSettings = async () => {
  try {
    const response = await api.get("/settings");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Site Settings API functions
export const updateSiteSettings = async (settingsData) => {
  try {
    const response = await api.post("/settings", settingsData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSiteLogo = async (logoUrl) => {
  try {
    const response = await api.put("/settings/logo", { logo: logoUrl });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSiteFavicon = async (faviconUrl) => {
  try {
    const response = await api.put("/settings/favicon", {
      favicon: faviconUrl,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBusinessHours = async (businessHours) => {
  try {
    const response = await api.put("/settings/business-hours", {
      businessHours,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateLocation = async (location) => {
  try {
    const response = await api.put("/settings/location", { location });
    return response.data;
  } catch (error) {
    throw error;
  }
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
    token: "mock-jwt-token-for-testing",
    user: {
      _id: "123456789",
      name: "John Doe",
      email: email,
      role: "user",
      profileImage: "https://via.placeholder.com/150",
    },
  };
  return mockApiCall(mockResponse);
};

export const mockRegisterUser = (userData) => {
  // Mock response for register
  const mockResponse = {
    token: "mock-jwt-token-for-testing",
    user: {
      _id: "123456789",
      name: userData.name,
      email: userData.email,
      role: "user",
      profileImage: "https://via.placeholder.com/150",
    },
  };
  return mockApiCall(mockResponse);
};

export const mockGetCurrentUser = () => {
  // Mock response for getting current user
  const storedUser = localStorage.getItem("user");
  const mockUser = storedUser
    ? JSON.parse(storedUser)
    : {
        _id: "123456789",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "user",
        profileImage: "https://via.placeholder.com/150",
      };

  return mockApiCall({ user: mockUser });
};

export const mockUpdateUserProfile = (userData) => {
  // Get current user from localStorage
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : {};

  // Create updated user object
  const updatedUser = { ...currentUser, ...userData };

  // If userData is FormData, handle differently
  if (userData instanceof FormData) {
    const name = userData.get("name");
    const email = userData.get("email");

    if (name) updatedUser.name = name;
    if (email) updatedUser.email = email;

    // Handle profile image
    if (userData.get("profileImage")) {
      // In a real app, this would be the URL returned from the server
      // For now, we'll use a placeholder
      updatedUser.profileImage = "https://via.placeholder.com/150";
    }
  }

  return mockApiCall(updatedUser);
};

// Mock Package API calls
export const mockGetPackages = () => {
  // Mock response for packages
  const packages = [
    {
      id: 1,
      title: "Swat Valley Adventure",
      desc: "Explore the stunning green meadows, rivers, and cultural heritage of Swat. This comprehensive tour takes you through the most beautiful spots in the region, with experienced guides and comfortable accommodations.",
      img: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      startPoint: "Islamabad",
      destinations: ["Kalam", "Malam Jabba", "Swat Valley"],
      duration: "5 days",
      price: 45000,
      rating: 4.8,
      coordinates: [
        { place: "Islamabad", lat: 33.6844, lng: 73.0479 },
        { place: "Kalam", lat: 35.4867, lng: 72.5798 },
        { place: "Malam Jabba", lat: 34.8156, lng: 72.5631 },
        { place: "Swat Valley", lat: 35.2227, lng: 72.4258 },
      ],
      images: [
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1586002990553-8850c4049470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      itinerary: [
        {
          day: 1,
          title: "Departure from Islamabad",
          description:
            "Early morning departure from Islamabad, travel through scenic routes to reach Kalam by evening.",
        },
        {
          day: 2,
          title: "Explore Kalam",
          description:
            "Visit local attractions including Kalam River, Ushu Forest, and enjoy local cuisine.",
        },
        {
          day: 3,
          title: "Malam Jabba",
          description:
            "Travel to Malam Jabba Ski Resort, enjoy the scenic beauty and adventure activities.",
        },
        {
          day: 4,
          title: "Swat Valley Tour",
          description:
            "Explore the main Swat Valley, visit historical sites and natural attractions.",
        },
        {
          day: 5,
          title: "Return to Islamabad",
          description:
            "Morning departure from Swat, arrive in Islamabad by evening.",
        },
      ],
    },
    {
      id: 2,
      title: "Kashmir Paradise Tour",
      desc: "Experience paradise on earth with mesmerizing valleys and serene lakes. This tour offers a perfect blend of natural beauty, adventure, and cultural experiences in the heart of Kashmir.",
      img: "https://images.unsplash.com/photo-1566837497312-7be4a9daf7a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      startPoint: "Lahore",
      destinations: ["Muzaffarabad", "Neelum Valley", "Pir Chinasi"],
      duration: "7 days",
      price: 65000,
      rating: 4.9,
      coordinates: [
        { place: "Lahore", lat: 31.5204, lng: 74.3587 },
        { place: "Muzaffarabad", lat: 34.3556, lng: 73.4761 },
        { place: "Neelum Valley", lat: 34.5889, lng: 73.9078 },
        { place: "Pir Chinasi", lat: 34.3852, lng: 73.5888 },
      ],
      images: [
        "https://images.unsplash.com/photo-1566837497312-7be4a9daf7a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1590677197930-c44bda2c5b9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1573909552611-f0b0c078b7b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ],
      itinerary: [
        {
          day: 1,
          title: "Departure from Lahore",
          description: "Morning departure from Lahore, travel to Muzaffarabad.",
        },
        {
          day: 2,
          title: "Muzaffarabad Exploration",
          description:
            "Visit local attractions, historical sites, and markets.",
        },
        {
          day: 3,
          title: "Travel to Neelum Valley",
          description:
            "Journey to the beautiful Neelum Valley, enjoy scenic views.",
        },
        {
          day: 4,
          title: "Neelum Valley Day 1",
          description: "Explore local attractions and natural beauty.",
        },
        {
          day: 5,
          title: "Neelum Valley Day 2",
          description:
            "Continue exploration with visits to remote villages and lakes.",
        },
        {
          day: 6,
          title: "Pir Chinasi",
          description:
            "Visit the famous Pir Chinasi mountain peak for panoramic views.",
        },
        {
          day: 7,
          title: "Return to Lahore",
          description: "Morning departure, arrive in Lahore by evening.",
        },
      ],
    },
  ];
  return mockApiCall({ packages });
};

export const mockGetPackage = (id) => {
  // Mock response for single package
  const packageData = {
    id: parseInt(id),
    title: id === "1" ? "Swat Valley Adventure" : "Kashmir Paradise Tour",
    desc:
      id === "1"
        ? "Explore the stunning green meadows, rivers, and cultural heritage of Swat."
        : "Experience paradise on earth with mesmerizing valleys and serene lakes.",
    img:
      id === "1"
        ? "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        : "https://images.unsplash.com/photo-1566837497312-7be4a9daf7a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    startPoint: id === "1" ? "Islamabad" : "Lahore",
    destinations:
      id === "1"
        ? ["Kalam", "Malam Jabba", "Swat Valley"]
        : ["Muzaffarabad", "Neelum Valley", "Pir Chinasi"],
    duration: id === "1" ? "5 days" : "7 days",
    price: id === "1" ? 45000 : 65000,
    rating: id === "1" ? 4.8 : 4.9,
    coordinates:
      id === "1"
        ? [
            { place: "Islamabad", lat: 33.6844, lng: 73.0479 },
            { place: "Kalam", lat: 35.4867, lng: 72.5798 },
            { place: "Malam Jabba", lat: 34.8156, lng: 72.5631 },
            { place: "Swat Valley", lat: 35.2227, lng: 72.4258 },
          ]
        : [
            { place: "Lahore", lat: 31.5204, lng: 74.3587 },
            { place: "Muzaffarabad", lat: 34.3556, lng: 73.4761 },
            { place: "Neelum Valley", lat: 34.5889, lng: 73.9078 },
            { place: "Pir Chinasi", lat: 34.3852, lng: 73.5888 },
          ],
    images:
      id === "1"
        ? [
            "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1586002990553-8850c4049470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          ]
        : [
            "https://images.unsplash.com/photo-1566837497312-7be4a9daf7a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1590677197930-c44bda2c5b9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1573909552611-f0b0c078b7b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          ],
    itinerary:
      id === "1"
        ? [
            {
              day: 1,
              title: "Departure from Islamabad",
              description:
                "Early morning departure from Islamabad, travel through scenic routes to reach Kalam by evening.",
            },
            {
              day: 2,
              title: "Explore Kalam",
              description:
                "Visit local attractions including Kalam River, Ushu Forest, and enjoy local cuisine.",
            },
            {
              day: 3,
              title: "Malam Jabba",
              description:
                "Travel to Malam Jabba Ski Resort, enjoy the scenic beauty and adventure activities.",
            },
            {
              day: 4,
              title: "Swat Valley Tour",
              description:
                "Explore the main Swat Valley, visit historical sites and natural attractions.",
            },
            {
              day: 5,
              title: "Return to Islamabad",
              description:
                "Morning departure from Swat, arrive in Islamabad by evening.",
            },
          ]
        : [
            {
              day: 1,
              title: "Departure from Lahore",
              description:
                "Morning departure from Lahore, travel to Muzaffarabad.",
            },
            {
              day: 2,
              title: "Muzaffarabad Exploration",
              description:
                "Visit local attractions, historical sites, and markets.",
            },
            {
              day: 3,
              title: "Travel to Neelum Valley",
              description:
                "Journey to the beautiful Neelum Valley, enjoy scenic views.",
            },
            {
              day: 4,
              title: "Neelum Valley Day 1",
              description: "Explore local attractions and natural beauty.",
            },
            {
              day: 5,
              title: "Neelum Valley Day 2",
              description:
                "Continue exploration with visits to remote villages and lakes.",
            },
            {
              day: 6,
              title: "Pir Chinasi",
              description:
                "Visit the famous Pir Chinasi mountain peak for panoramic views.",
            },
            {
              day: 7,
              title: "Return to Lahore",
              description: "Morning departure, arrive in Lahore by evening.",
            },
          ],
  };
  return mockApiCall({ package: packageData });
};

export const mockCreateBooking = (bookingData) => {
  // Mock response for booking creation
  const newBooking = {
    _id: `bk-${Date.now()}`,
    ...bookingData,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: new Date().toISOString(),
  };
  return mockApiCall({ booking: newBooking });
};

export const mockGetUserBookings = () => {
  // Mock response for user bookings
  const bookings = [
    {
      _id: "BK-2025-001",
      packageName: "Swat Valley Adventure",
      packageImage: "https://source.unsplash.com/random/300x200/?swat,valley",
      bookingDate: "2025-04-15",
      startDate: "2025-06-10",
      endDate: "2025-06-15",
      totalAmount: 45000,
      status: "confirmed",
      paymentStatus: "paid",
      persons: 2,
    },
    {
      _id: "BK-2025-002",
      packageName: "Kashmir Paradise Tour",
      packageImage: "https://source.unsplash.com/random/300x200/?kashmir",
      bookingDate: "2025-03-20",
      startDate: "2025-07-05",
      endDate: "2025-07-12",
      totalAmount: 65000,
      status: "pending",
      paymentStatus: "partial",
      persons: 3,
    },
  ];
  return mockApiCall({ bookings });
};

export const mockGetBookingDetails = (id) => {
  // Mock response for booking details
  const booking = {
    _id: id,
    packageName:
      id === "BK-2025-001" ? "Swat Valley Adventure" : "Kashmir Paradise Tour",
    packageImage:
      id === "BK-2025-001"
        ? "https://source.unsplash.com/random/800x400/?swat,valley"
        : "https://source.unsplash.com/random/800x400/?kashmir",
    bookingDate: id === "BK-2025-001" ? "2025-04-15" : "2025-03-20",
    startDate: id === "BK-2025-001" ? "2025-06-10" : "2025-07-05",
    endDate: id === "BK-2025-001" ? "2025-06-15" : "2025-07-12",
    totalAmount: id === "BK-2025-001" ? 45000 : 65000,
    status: id === "BK-2025-001" ? "confirmed" : "pending",
    paymentStatus: id === "BK-2025-001" ? "paid" : "partial",
    persons: id === "BK-2025-001" ? 2 : 3,
    packageDetails: {
      duration: id === "BK-2025-001" ? "5 days, 4 nights" : "7 days, 6 nights",
      location:
        id === "BK-2025-001" ? "Swat Valley, Pakistan" : "Kashmir, Pakistan",
      includes: [
        "Hotel accommodation",
        "Breakfast and dinner",
        "Transportation",
        "Tour guide",
        "Sightseeing activities",
      ],
    },
  };
  return mockApiCall({ booking });
};

// Mock Review API calls
export const mockCreateReview = (reviewData) => {
  // Mock response for review creation
  const newReview = {
    _id: `rev-${Date.now()}`,
    ...reviewData,
    createdAt: new Date().toISOString(),
  };
  return mockApiCall({ review: newReview });
};

export const mockGetReviews = () => {
  // Mock response for reviews
  const reviews = [
    {
      _id: "rev1",
      packageId: "pkg1",
      userId: "user1",
      userName: "John Doe",
      rating: 5,
      comment: "Amazing experience! Would definitely recommend.",
      createdAt: "2025-03-15T10:30:00Z",
    },
    {
      _id: "rev2",
      packageId: "pkg2",
      userId: "user2",
      userName: "Jane Smith",
      rating: 4,
      comment: "Great tour package, but the food could be better.",
      createdAt: "2025-03-10T14:45:00Z",
    },
  ];
  return mockApiCall({ reviews });
};

export default api;
