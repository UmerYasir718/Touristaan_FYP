import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { resetPassword } from '../utils/api';

const ResetPassword = () => {
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  // Initial form values
  const initialValues = {
    password: '',
    confirmPassword: ''
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await resetPassword(token, values.password);
      setResetSuccess(true);
      setResetError('');
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      // console.error('Error resetting password:', error);
      setResetError(
        error.response?.data?.message || 
        'An error occurred while resetting your password. The link may have expired or is invalid.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(120deg,#2c5282 60%,#4299e1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 450,
        background: '#fff',
        padding: '2.5rem',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(44,82,130,0.12)'
      }}>
        <div className="text-center mb-4">
          <i className="fas fa-lock-open fa-2x text-primary mb-2"></i>
          <h2 className="auth-title fw-bold" style={{ color: '#2c5282' }}>Reset Password</h2>
          <p className="text-muted">Create a new password for your account</p>
        </div>
        
        {resetError && (
          <Alert variant="danger" onClose={() => setResetError('')} dismissible>
            {resetError}
          </Alert>
        )}
        
        {resetSuccess ? (
          <div className="text-center">
            <Alert variant="success">
              Your password has been reset successfully. You can now log in with your new password.
            </Alert>
            <p className="mt-3 mb-4 text-muted">
              Redirecting to login page...
            </p>
            <Link to="/login" className="btn btn-primary rounded-pill px-4">
              Go to Login
            </Link>
          </div>
        ) : (
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
                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label>New Password</Form.Label>
                  <InputGroup className="shadow-sm">
                    <InputGroup.Text className="bg-white border-end-0 rounded-start">
                      <i className="fas fa-lock text-primary"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter new password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password && errors.password}
                      className="py-2 border-start-0 border-end-0"
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={togglePasswordVisibility}
                      className="border-start-0 bg-white rounded-end"
                      type="button"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted mt-2">
                    Password must be at least 6 characters long
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formConfirmPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <InputGroup className="shadow-sm">
                    <InputGroup.Text className="bg-white border-end-0 rounded-start">
                      <i className="fas fa-lock text-primary"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.confirmPassword && errors.confirmPassword}
                      className="py-2 border-start-0 border-end-0"
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={toggleConfirmPasswordVisibility}
                      className="border-start-0 bg-white rounded-end"
                      type="button"
                    >
                      <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isSubmitting}
                    className="py-2 rounded-pill"
                    style={{ 
                      background: 'linear-gradient(to right, #2c5282, #4299e1)',
                      border: 'none'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Resetting...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <Link to="/login" className="text-decoration-none">
                    <i className="fas fa-arrow-left me-1"></i> Back to Login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
