// Root reducer 
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import bookingReducer from './bookingReducer';
import packageReducer from './packageReducer';

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  booking: bookingReducer,
  package: packageReducer
});