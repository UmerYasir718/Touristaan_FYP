import setAuthToken from '../../utils/setAuthToken';
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
import {
  loginUser,
  loginAdmin,
  registerUser,
  getCurrentUser,
  updateUserProfile,
  mockLoginUser,
  mockRegisterUser,
  mockGetCurrentUser,
  mockUpdateUserProfile
} from '../../utils/api';

// Flag to toggle between real API and mock API
const USE_REAL_API = true;

// Load User
export const loadUser = () => async dispatch => {
  try {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      // If no token, dispatch AUTH_ERROR to set isAuthenticated to false
      return dispatch({ type: AUTH_ERROR });
    }
    
    // Set auth token in axios headers
    setAuthToken(token);
    
    // Try to get user data from localStorage first as a fallback
    const storedUser = localStorage.getItem('user');
    let userData = null;
    
    if (storedUser) {
      try {
        userData = JSON.parse(storedUser);
        // If we have user data in localStorage, dispatch it immediately
        // This ensures we always have user data even if the API call fails
        dispatch({
          type: USER_LOADED,
          payload: userData
        });
      } catch (parseError) {
        // console.error('Error parsing stored user data:', parseError);
      }
    }
    
    // Make API call to get current user (to refresh the data)
    const res = USE_REAL_API 
      ? await getCurrentUser()
      : await mockGetCurrentUser();
    
    // Update with fresh data from API
    dispatch({
      type: USER_LOADED,
      payload: res.data.user
    });
  } catch (err) {
    // console.error('Error loading user:', err);
    
    // Check if we still have user data in localStorage before dispatching error
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // If we have valid user data, keep the user authenticated
        return dispatch({
          type: USER_LOADED,
          payload: userData
        });
      } catch (parseError) {
        // console.error('Error parsing stored user data:', parseError);
      }
    }
    
    // If all else fails, dispatch AUTH_ERROR
    dispatch({
      type: AUTH_ERROR,
      payload: err.response?.data?.error || 'Server Error'
    });
  }
};

// Register User
export const register = (formData) => async dispatch => {
  try {
    const res = USE_REAL_API
      ? await registerUser(formData)
      : await mockRegisterUser(formData);

    // console.log('Register response:', res.data);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    // Set auth token for subsequent requests
    if (res.data.token) {
      setAuthToken(res.data.token);
    }

    dispatch(loadUser());
  } catch (err) {
    // console.error('Error registering user:', err);
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response?.data?.error || 'Server Error'
    });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  try {
    const res = USE_REAL_API
      ? await loginUser(email, password)
      : await mockLoginUser(email, password);

    // console.log('Login response:', res.data);

    // Check if the response has the expected structure
    if (!res.data || !res.data.token) {
      throw new Error('Invalid response format: missing token');
    }

    // Make sure user data exists in the response
    if (!res.data.user) {
      // console.error('Warning: User data missing in login response');
      // Create a minimal user object if missing
      res.data.user = { email };
    }

    // Manually save user data to localStorage for redundancy
    try {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // console.log('User data manually saved to localStorage in login action:', res.data.user);
    } catch (storageError) {
      // console.error('Error saving to localStorage in login action:', storageError);
    }

    // Dispatch LOGIN_SUCCESS with the response data
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    // Set auth token for subsequent requests
    setAuthToken(res.data.token);

    // Dispatch loadUser to ensure user data is properly loaded
    dispatch(loadUser());
  } catch (err) {
    // console.error('Error logging in:', err);
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.error || 'Server Error'
    });
  }
};

// Admin Login
export const loginAsAdmin = (email, password) => async dispatch => {
  try {
    // Use the admin login endpoint
    const res = USE_REAL_API
      ? await loginAdmin(email, password)
      : await mockLoginUser(email, password); // Using regular mock for testing

    // console.log('Admin Login response:', res.data);

    // Check if the response has the expected structure
    if (!res.data || !res.data.token) {
      throw new Error('Invalid response format: missing token');
    }

    // Make sure user data exists in the response
    if (!res.data.user) {
      // console.error('Warning: User data missing in admin login response');
      // Create a minimal admin user object if missing
      res.data.user = { email, role: 'admin' };
    } else if (!res.data.user.role || res.data.user.role !== 'admin') {
      // console.error('Warning: User is not an admin');
      throw new Error('Unauthorized: User is not an admin');
    }

    // Manually save user data to localStorage for redundancy
    try {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('isAdmin', 'true'); // Flag to indicate admin login
      // console.log('Admin data manually saved to localStorage:', res.data.user);
    } catch (storageError) {
      // console.error('Error saving to localStorage in admin login action:', storageError);
    }

    // Dispatch ADMIN_LOGIN_SUCCESS with the response data
    dispatch({
      type: ADMIN_LOGIN_SUCCESS,
      payload: res.data
    });

    // Set auth token for subsequent requests
    setAuthToken(res.data.token);

    // Dispatch loadUser to ensure user data is properly loaded
    dispatch(loadUser());
  } catch (err) {
    // console.error('Error logging in as admin:', err);
    dispatch({
      type: ADMIN_LOGIN_FAIL,
      payload: err.response?.data?.error || 'Server Error'
    });
  }
};

// Update Profile
export const updateProfile = (formData) => async dispatch => {
  try {
    const res = USE_REAL_API
      ? await updateUserProfile(formData)
      : await mockUpdateUserProfile(formData);
    
    // console.log('Update profile response:', res.data);
    
    dispatch({
      type: PROFILE_UPDATE_SUCCESS,
      payload: res.data
    });
    
    return Promise.resolve(res.data);
  } catch (err) {
    // console.error('Error updating profile:', err);
    dispatch({
      type: PROFILE_UPDATE_FAIL,
      payload: err.response?.data?.error || 'Failed to update profile'
    });
    
    return Promise.reject(err);
  }
};

// Logout
export const logout = () => dispatch => {
  // Clear token and user data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isAdmin');
  
  // Remove auth token from axios headers
  setAuthToken(null);
  
  // Dispatch logout action
  dispatch({ type: LOGOUT });
  
  // Redirect to login page
  window.location.href = '/login';
};
