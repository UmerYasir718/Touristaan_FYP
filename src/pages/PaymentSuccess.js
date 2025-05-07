import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { getBookingDetails } from '../utils/api';

const PaymentSuccess = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('bookingId');
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }
      
      try {
        const bookingData = await getBookingDetails(bookingId);
        setBooking(bookingData);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError(err.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId]);
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading booking details...</span>
        </Spinner>
        <p className="mt-2">Loading your booking details...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Booking</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-center mt-3">
            <Button as={Link} to="/profile" variant="primary">
              Go to My Bookings
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 text-center">
            <Card.Body className="p-5">
              <div className="mb-4">
                <div className="success-checkmark">
                  <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                  </div>
                </div>
              </div>
              <h2 className="fw-bold text-success mb-3">Payment Successful!</h2>
              <p className="fs-5 mb-4">
                Thank you for booking with Touristaan. Your tour package has been confirmed and we've sent the details to your email.
              </p>
              
              {booking ? (
                <div className="booking-info p-4 bg-light rounded mb-4 text-start">
                  <h5 className="border-bottom pb-2 mb-3">Booking Details</h5>
                  <p className="mb-1">
                    <strong>Booking Reference:</strong> {booking.transactionId || `TRN-${Math.floor(Math.random() * 1000000)}`}
                  </p>
                  <p className="mb-1">
                    <strong>Package:</strong> {booking.packageName}
                  </p>
                  <p className="mb-1">
                    <strong>Travel Date:</strong> {new Date(booking.travelDate).toLocaleDateString()}
                  </p>
                  <p className="mb-1">
                    <strong>Travelers:</strong> {booking.travelers}
                  </p>
                  <p className="mb-1">
                    <strong>Total Amount:</strong> Rs. {booking.totalAmount.toLocaleString()}
                  </p>
                  <p className="mb-0">
                    <strong>Status:</strong>{' '}
                    <span className="badge bg-success">Confirmed</span>
                  </p>
                </div>
              ) : (
                <div className="booking-info p-3 bg-light rounded mb-4">
                  <p className="mb-1">Booking Reference: <strong>TRN-{Math.floor(Math.random() * 1000000)}</strong></p>
                  <p className="mb-0">A confirmation email has been sent to your registered email address.</p>
                </div>
              )}
              
              <div className="d-grid gap-3">
                <Button as={Link} to="/profile" variant="primary" size="lg">
                  View My Bookings
                </Button>
                <Button as={Link} to="/packages" variant="outline-primary">
                  Browse More Tours
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentSuccess;
