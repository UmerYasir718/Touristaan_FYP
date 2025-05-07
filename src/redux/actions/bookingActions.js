import {
  GET_BOOKINGS_SUCCESS,
  GET_BOOKINGS_FAIL,
  GET_BOOKING_SUCCESS,
  GET_BOOKING_FAIL,
  CREATE_BOOKING_SUCCESS,
  CREATE_BOOKING_FAIL,
  CANCEL_BOOKING_SUCCESS,
  CANCEL_BOOKING_FAIL,
} from "../types";

// Get user bookings
export const getUserBookings = () => async (dispatch) => {
  try {
    // In a real app, you would make an API call to get the user's bookings
    // const res = await api.get('/bookings');

    // For now, simulate a successful response with mock data
    const mockBookings = [
      {
        id: "BK-2025-001",
        packageName: "Swat Valley Adventure",
        packageImage: "https://source.unsplash.com/random/300x200/?swat,valley",
        bookingDate: "2025-04-15",
        startDate: "2025-06-10",
        endDate: "2025-06-15",
        totalAmount: 45000,
        status: "confirmed",
        paymentStatus: "paid",
        persons: 2,
        packageDetails: {
          duration: "5 days, 4 nights",
          location: "Swat Valley, Pakistan",
          includes: [
            "Hotel accommodation",
            "Breakfast and dinner",
            "Transportation",
            "Tour guide",
          ],
        },
      },
      {
        id: "BK-2025-002",
        packageName: "Kashmir Paradise Tour",
        packageImage: "https://source.unsplash.com/random/300x200/?kashmir",
        bookingDate: "2025-03-20",
        startDate: "2025-07-05",
        endDate: "2025-07-12",
        totalAmount: 65000,
        status: "pending",
        paymentStatus: "partial",
        persons: 3,
        packageDetails: {
          duration: "7 days, 6 nights",
          location: "Kashmir, Pakistan",
          includes: [
            "Luxury hotel accommodation",
            "All meals",
            "Transportation",
            "Tour guide",
            "Boat ride",
          ],
        },
      },
      {
        id: "BK-2025-003",
        packageName: "Naran Kaghan Expedition",
        packageImage: "https://source.unsplash.com/random/300x200/?naran",
        bookingDate: "2025-02-10",
        startDate: "2025-05-15",
        endDate: "2025-05-20",
        totalAmount: 38000,
        status: "cancelled",
        paymentStatus: "refunded",
        persons: 2,
        packageDetails: {
          duration: "5 days, 4 nights",
          location: "Naran Kaghan, Pakistan",
          includes: [
            "Hotel accommodation",
            "Breakfast",
            "Transportation",
            "Tour guide",
          ],
        },
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      dispatch({
        type: GET_BOOKINGS_SUCCESS,
        payload: mockBookings,
      });
    }, 1000);
  } catch (err) {
    dispatch({
      type: GET_BOOKINGS_FAIL,
      payload: err.response?.data?.error || "Failed to fetch bookings",
    });
  }
};

// Get single booking
export const getBooking = (id) => async (dispatch) => {
  try {
    // In a real app, you would make an API call to get the booking details
    // const res = await api.get(`/bookings/${id}`);

    // For now, simulate a successful response with mock data
    const mockBookings = [
      {
        id: "BK-2025-001",
        packageName: "Swat Valley Adventure",
        packageImage: "https://source.unsplash.com/random/800x400/?swat,valley",
        bookingDate: "2025-04-15",
        startDate: "2025-06-10",
        endDate: "2025-06-15",
        totalAmount: 45000,
        status: "confirmed",
        paymentStatus: "paid",
        persons: 2,
        packageDetails: {
          duration: "5 days, 4 nights",
          location: "Swat Valley, Pakistan",
          includes: [
            "Hotel accommodation",
            "Breakfast and dinner",
            "Transportation",
            "Tour guide",
            "Sightseeing activities",
            "Welcome drink",
          ],
        },
      },
      {
        id: "BK-2025-002",
        packageName: "Kashmir Paradise Tour",
        packageImage: "https://source.unsplash.com/random/800x400/?kashmir",
        bookingDate: "2025-03-20",
        startDate: "2025-07-05",
        endDate: "2025-07-12",
        totalAmount: 65000,
        status: "pending",
        paymentStatus: "partial",
        persons: 3,
        packageDetails: {
          duration: "7 days, 6 nights",
          location: "Kashmir, Pakistan",
          includes: [
            "Luxury hotel accommodation",
            "All meals",
            "Transportation",
            "Tour guide",
            "Boat ride",
            "Sightseeing activities",
            "Welcome gift",
          ],
        },
      },
      {
        id: "BK-2025-003",
        packageName: "Naran Kaghan Expedition",
        packageImage: "https://source.unsplash.com/random/800x400/?naran",
        bookingDate: "2025-02-10",
        startDate: "2025-05-15",
        endDate: "2025-05-20",
        totalAmount: 38000,
        status: "cancelled",
        paymentStatus: "refunded",
        persons: 2,
        packageDetails: {
          duration: "5 days, 4 nights",
          location: "Naran Kaghan, Pakistan",
          includes: [
            "Hotel accommodation",
            "Breakfast",
            "Transportation",
            "Tour guide",
            "Hiking activities",
            "Campfire night",
          ],
        },
      },
    ];

    const booking = mockBookings.find((b) => b.id === id);

    if (!booking) {
      dispatch({
        type: GET_BOOKING_FAIL,
        payload: "Booking not found",
      });
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      dispatch({
        type: GET_BOOKING_SUCCESS,
        payload: booking,
      });
    }, 1000);
  } catch (err) {
    dispatch({
      type: GET_BOOKING_FAIL,
      payload: err.response?.data?.error || "Failed to fetch booking details",
    });
  }
};

// Create booking
export const createBooking = (bookingData) => async (dispatch) => {
  try {
    // In a real app, you would make an API call to create a booking
    // const res = await api.post('/bookings', bookingData);

    // For now, simulate a successful response
    setTimeout(() => {
      dispatch({
        type: CREATE_BOOKING_SUCCESS,
        payload: {
          id: `BK-${new Date().getFullYear()}-${Math.floor(
            1000 + Math.random() * 9000
          )}`,
          ...bookingData,
          bookingDate: new Date().toISOString().split("T")[0],
          status: "pending",
          paymentStatus: "unpaid",
        },
      });
    }, 1000);
  } catch (err) {
    dispatch({
      type: CREATE_BOOKING_FAIL,
      payload: err.response?.data?.error || "Failed to create booking",
    });
  }
};

// Cancel booking
export const cancelBooking = (id) => async (dispatch) => {
  try {
    // In a real app, you would make an API call to cancel a booking
    // const res = await api.put(`/bookings/${id}/cancel`);

    // For now, simulate a successful response
    setTimeout(() => {
      dispatch({
        type: CANCEL_BOOKING_SUCCESS,
        payload: id,
      });
    }, 1000);
  } catch (err) {
    dispatch({
      type: CANCEL_BOOKING_FAIL,
      payload: err.response?.data?.error || "Failed to cancel booking",
    });
  }
};
