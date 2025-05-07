import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { forgotPassword } from '../utils/api';

const ForgotPassword = () => {
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
  });

  // Initial form values
  const initialValues = {
    email: ''
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await forgotPassword(values.email);
      setResetSent(true);
      setResetError('');
    } catch (error) {
      // console.error('Error sending reset email:', error);
      setResetError(
        error.response?.data?.message || 
        'An error occurred while sending the reset email. Please try again.'
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
          <i className="fas fa-key fa-2x text-primary mb-2"></i>
          <h2 className="auth-title fw-bold" style={{ color: '#2c5282' }}>Forgot Password</h2>
          <p className="text-muted">Enter your email to receive password reset instructions</p>
        </div>
        
        {resetError && (
          <Alert variant="danger" onClose={() => setResetError('')} dismissible>
            {resetError}
          </Alert>
        )}
        
        {resetSent ? (
          <div className="text-center">
            <Alert variant="success">
              If an account with that email exists, a password reset link has been sent.
            </Alert>
            <p className="mt-3 mb-4 text-muted">
              Please check your email inbox and spam folder. The link will expire in 1 hour.
            </p>
            <Link to="/login" className="btn btn-primary rounded-pill px-4">
              Return to Login
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
                <Form.Group className="mb-4" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <InputGroup className="shadow-sm">
                    <InputGroup.Text className="bg-white border-end-0 rounded-start">
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
                      className="py-2 border-start-0"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted mt-2">
                    We'll send password reset instructions to this email.
                  </Form.Text>
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
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
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

export default ForgotPassword;
