import {
  GET_BOOKINGS_SUCCESS,
  GET_BOOKINGS_FAIL,
  GET_BOOKING_SUCCESS,
  GET_BOOKING_FAIL,
  CREATE_BOOKING_SUCCESS,
  CREATE_BOOKING_FAIL,
  CANCEL_BOOKING_SUCCESS,
  CANCEL_BOOKING_FAIL
} from '../types';

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: true,
  error: null
};

const bookingReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_BOOKINGS_SUCCESS:
      return {
        ...state,
        bookings: payload,
        loading: false,
        error: null
      };
    case GET_BOOKING_SUCCESS:
      return {
        ...state,
        currentBooking: payload,
        loading: false,
        error: null
      };
    case CREATE_BOOKING_SUCCESS:
      return {
        ...state,
        bookings: [payload, ...state.bookings],
        loading: false,
        error: null
      };
    case CANCEL_BOOKING_SUCCESS:
      return {
        ...state,
        bookings: state.bookings.map(booking => 
          booking.id === payload 
            ? { ...booking, status: 'cancelled' } 
            : booking
        ),
        loading: false,
        error: null
      };
    case GET_BOOKINGS_FAIL:
    case GET_BOOKING_FAIL:
    case CREATE_BOOKING_FAIL:
    case CANCEL_BOOKING_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  }
};

export default bookingReducer;
