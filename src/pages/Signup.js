import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { register } from '../redux/actions/authActions';
import '../styles/password-toggle.css';

const Signup = ({ register, isAuthenticated, error }) => {
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Set error message if signup fails
    if (error) {
      setSignupError(error);
      setSignupSuccess(false);
    }
  }, [isAuthenticated, error, navigate]);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  // Initial form values
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    // Make sure passwords match
    if (values.password !== values.confirmPassword) {
      setSignupError('Passwords do not match');
      setSubmitting(false);
      return;
    }

    // Call the register action from Redux
    const { name, email, password } = values;
    register({ name, email, password });
    setSubmitting(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="auth-page" style={{
      minHeight: '100vh',
      width: '100%',
      background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '550px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }}>
        <div className="text-center mb-4">
          <div className="mb-3">
            <i className="fas fa-mountain fa-3x text-primary"></i>
            <i className="fas fa-plane fa-2x text-info mx-2"></i>
            <i className="fas fa-map-marker-alt fa-3x text-danger"></i>
          </div>
          <h2 className="auth-title fw-bold" style={{ color: '#2c5282' }}>Join Touristaan Today</h2>
          <p className="text-muted">Start your journey to amazing destinations</p>
        </div>

        {signupError && (
          <Alert variant="danger" onClose={() => setSignupError('')} dismissible>
            {signupError}
          </Alert>
        )}
        {signupSuccess && (
          <Alert variant="success">Signup successful! Redirecting to login...</Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="formName">
                <Form.Label>Full Name</Form.Label>
                <InputGroup className="input-group-seamless shadow-none">
                  <InputGroup.Text className="bg-white border-end-0 rounded-start rounded-0">
                    <i className="fas fa-user text-primary"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.name && errors.name}
                    className="py-2 border-start-0 rounded-0 rounded-end shadow-none"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formEmail">
                <Form.Label>Email Address</Form.Label>
                <InputGroup className="input-group-seamless shadow-none">
                  <InputGroup.Text className="bg-white border-end-0 rounded-start rounded-0">
                    <i className="fas fa-envelope text-primary"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && errors.email}
                    className="py-2 border-start-0 rounded-0 rounded-end shadow-none"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <InputGroup className="shadow-sm">
                  <InputGroup.Text className="bg-white border-end-0 rounded-start">
                    <i className="fas fa-lock text-primary"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password && !!errors.password}
                    autoComplete="new-password"
                    className="py-2 border-start-0 border-end-0"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                    className="password-toggle-btn"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onMouseDown={e => e.preventDefault()}
                  >
                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup className="shadow-sm">
                  <InputGroup.Text className="bg-white border-end-0 rounded-start">
                    <i className="fas fa-lock text-primary"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                    autoComplete="new-password"
                    className="py-2 border-start-0 border-end-0"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={toggleConfirmPasswordVisibility}
                    tabIndex={-1}
                    className="password-toggle-btn"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    onMouseDown={e => e.preventDefault()}
                  >
                    <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Button 
                type="submit" 
                className="w-100 py-2 mb-3 rounded-pill shadow-none" 
                disabled={isSubmitting}
                style={{ 
                  background: 'linear-gradient(to right, #2c5282, #4299e1)',
                  border: 'none'
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus me-2"></i>
                    Sign Up
                  </>
                )}
              </Button>

              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account? <Link to="/login" className="text-primary fw-bold">Login</Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.auth.error
});

export default connect(mapStateToProps, { register })(Signup);
