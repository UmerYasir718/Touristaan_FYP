import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGIN_FAIL
} from '../types';

// Get user from localStorage if available
let storedUser = null;
try {
  const userString = localStorage.getItem('user');
  if (userString) {
    storedUser = JSON.parse(userString);
    console.log('Loaded user from localStorage:', storedUser);
  }
} catch (error) {
  console.error('Error parsing user from localStorage:', error);
  localStorage.removeItem('user'); // Remove invalid data
}

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: localStorage.getItem('token') ? true : false,
  loading: !localStorage.getItem('token'),
  user: storedUser,
  error: null
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      console.log('USER_LOADED action received with payload:', payload);
      // Store user in localStorage
      if (payload) {
        try {
          localStorage.setItem('user', JSON.stringify(payload));
          console.log('User saved to localStorage in USER_LOADED');
        } catch (error) {
          console.error('Error saving user to localStorage:', error);
        }
      }
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case ADMIN_LOGIN_SUCCESS:
      // Log the payload for debugging
      console.log('Auth reducer payload for LOGIN/REGISTER/ADMIN:', payload);
      
      // Handle API response format: { success, token, user }
      // Make sure we have a token
      if (!payload || !payload.token) {
        console.error('Invalid auth payload:', payload);
        return {
          ...state,
          error: 'Invalid authentication response'
        };
      }
      
      // Store token in localStorage
      localStorage.setItem('token', payload.token);
      
      // Extract user from payload based on API response format
      const user = payload.user || {};
      console.log('User data to be saved:', user);
      
      // Store user in localStorage
      try {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('User saved to localStorage in LOGIN/REGISTER/ADMIN');
        
        // For admin login, set the isAdmin flag
        if (type === ADMIN_LOGIN_SUCCESS) {
          localStorage.setItem('isAdmin', 'true');
          console.log('Admin flag set in localStorage');
        }
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
      
      return {
        ...state,
        token: payload.token,
        user: user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case PROFILE_UPDATE_SUCCESS:
      const updatedUser = { ...state.user, ...payload };
      try {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Updated user saved to localStorage');
      } catch (error) {
        console.error('Error saving updated user to localStorage:', error);
      }
      return {
        ...state,
        loading: false,
        user: updatedUser,
        error: null
      };
    case PROFILE_UPDATE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case ADMIN_LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      console.log('User and token removed from localStorage');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: payload
      };
    default:
      return state;
  }
};

export default authReducer;
