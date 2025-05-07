import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, ListGroup, Spinner, Modal } from 'react-bootstrap';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { getBookingById, getCurrentUser, cancelBooking } from '../utils/api';
import { formatDate } from '../utils/helpers';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData?.data?.data);
        setAuthLoading(false);
      } catch (err) {
        console.error("Error checking authentication:", err);
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch booking details using the API
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await getBookingById(id);
        
        if (response?.data) {
          setBooking(response.data);
        } else {
          setError('Booking not found');
        }
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to load booking details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchBookingDetails();
    }
  }, [id, user, authLoading]);

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    try {
      setCancelLoading(true);
      setCancelError(null);
      
      const response = await cancelBooking(id);
      
      if (response?.success) {
        setCancelSuccess(true);
        // Update the booking status in the current state
        setBooking(prev => ({
          ...prev,
          status: 'cancelled'
        }));
        
        // Close the modal after a short delay
        setTimeout(() => {
          setShowCancelModal(false);
          // Refresh the booking data
          getBookingById(id).then(res => {
            if (res?.data) {
              setBooking(res.data);
            }
          });
        }, 2000);
      } else {
        setCancelError(response?.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setCancelError(err.response?.data?.message || err.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }

  if (authLoading || loading) {
    return (
      <div className="py-5 text-center">
        <Container>
          <Spinner animation="border" variant="primary" />
          <h2 className="mt-3">Loading booking details...</h2>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-5">
        <Container>
          <Alert variant="danger">{error}</Alert>
          <div className="text-center mt-4">
            <Button as={Link} to="/bookings" variant="primary">
              Return to Bookings
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-5 text-center">
        <Container>
          <Alert variant="warning">Booking not found</Alert>
          <div className="mt-4">
            <Button as={Link} to="/bookings" variant="primary">
              Return to Bookings
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // Helper function to get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Helper function to get payment status badge variant
  const getPaymentVariant = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "partial":
        return "info";
      case "unpaid":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="py-5">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="display-4 fw-bold mb-3">Booking Details</h1>
              <p className="lead">View the details of your tour booking</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          <Col lg={8}>
            {/* Booking Summary Card */}
            <Card className="border-0 shadow-lg mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="mb-0">Booking Summary</h3>
                  <div>
                    <span className={`badge bg-${getStatusVariant(booking.status)} me-2`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <span className={`badge bg-${getPaymentVariant(booking.paymentStatus)}`}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <Row className="mb-4">
                  <Col md={5}>
                    <img
                      src={booking.packageImage || booking.package?.images?.[0] || "https://source.unsplash.com/random/600x400/?travel"}
                      alt={booking.packageName || booking.package?.title}
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  </Col>
                  <Col md={7}>
                    <h4>{booking.packageName || booking.package?.title}</h4>
                    <p className="text-muted mb-2">
                      <small>Booking ID: {booking._id || booking.id}</small>
                    </p>
                    <p className="mb-2">
                      <i className="far fa-calendar-alt me-2 text-primary"></i>
                      <strong>Booking Date:</strong> {formatDate(booking.bookingDate)}
                    </p>
                    <p className="mb-2">
                      <i className="fas fa-calendar-day me-2 text-primary"></i>
                      <strong>Travel Dates:</strong> {booking.startDate} to {booking.endDate}
                    </p>
                    <p className="mb-2">
                      <i className="fas fa-users me-2 text-primary"></i>
                      <strong>Travelers:</strong> {booking.persons || 2} persons
                    </p>
                    <h5 className="text-primary mt-3">
                      Rs. {booking.totalAmount.toLocaleString()}
                    </h5>
                  </Col>
                </Row>

                {/* Package Details */}
                {booking.packageDetails && (
                  <div className="mt-4">
                    <h4 className="mb-3">Package Details</h4>
                    <Row>
                      <Col md={6}>
                        <p>
                          <strong>Duration:</strong> {booking.packageDetails.duration}
                        </p>
                        <p>
                          <strong>Location:</strong> {booking.packageDetails.location}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p className="mb-2">
                          <strong>Includes:</strong>
                        </p>
                        <ul className="ps-3">
                          {booking.packageDetails.includes?.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Booking Actions */}
                <div className="mt-4 d-flex justify-content-between">
                  <Button as={Link} to="/bookings" variant="outline-primary">
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Bookings
                  </Button>
                  {booking.status === "pending" && (
                    <Button 
                      variant="outline-danger"
                      onClick={() => setShowCancelModal(true)}
                    >
                      <i className="fas fa-times-circle me-2"></i>
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Payment Information */}
            <Card className="border-0 shadow-lg mb-4">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Payment Information</h4>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <span>Package Price</span>
                    <span>Rs. {(booking.packagePrice || booking.totalAmount).toLocaleString()}</span>
                  </ListGroup.Item>
                  {booking.discount > 0 && (
                    <ListGroup.Item className="d-flex justify-content-between align-items-center text-success">
                      <span>Discount</span>
                      <span>- Rs. {booking.discount.toLocaleString()}</span>
                    </ListGroup.Item>
                  )}
                  {booking.tax > 0 && (
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Tax</span>
                      <span>Rs. {booking.tax.toLocaleString()}</span>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item className="d-flex justify-content-between align-items-center fw-bold">
                    <span>Total Amount</span>
                    <span>Rs. {booking.totalAmount.toLocaleString()}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <span>Payment Status</span>
                    <span className={`badge bg-${getPaymentVariant(booking.paymentStatus)}`}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </ListGroup.Item>
                  {booking.paymentMethod && (
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Payment Method</span>
                      <span>{booking.paymentMethod}</span>
                    </ListGroup.Item>
                  )}
                </ListGroup>

                {/* Removed Pay Now button as requested */}
              </Card.Body>
            </Card>

            {/* Contact Information */}
            <Card className="border-0 shadow-lg">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Need Help?</h4>
              </Card.Header>
              <Card.Body>
                <p>
                  If you have any questions about your booking, please contact our customer support:
                </p>
                <p className="mb-2">
                  <i className="fas fa-phone-alt me-2 text-primary"></i>
                  +92 300 1234567
                </p>
                <p className="mb-2">
                  <i className="fas fa-envelope me-2 text-primary"></i>
                  support@touristaan.com
                </p>
                <div className="d-grid gap-2 mt-3">
                  <Button as={Link} to="/contact" variant="outline-primary">
                    <i className="fas fa-comment-dots me-2"></i>
                    Contact Us
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Cancel Booking Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => !cancelLoading && setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cancelSuccess ? (
            <Alert variant="success">
              <i className="fas fa-check-circle me-2"></i>
              Your booking has been successfully cancelled.
            </Alert>
          ) : (
            <>
              <p>Are you sure you want to cancel this booking?</p>
              <p className="mb-0"><strong>Package:</strong> {booking.packageName || booking.package?.title}</p>
              <p className="mb-0"><strong>Travel Dates:</strong> {booking.startDate} to {booking.endDate}</p>
              <p className="mb-0"><strong>Amount:</strong> Rs. {booking.totalAmount.toLocaleString()}</p>
              
              {cancelError && (
                <Alert variant="danger" className="mt-3">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {cancelError}
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!cancelSuccess && (
            <>
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
              >
                No, Keep Booking
              </Button>
              <Button 
                variant="danger" 
                onClick={handleCancelBooking}
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel Booking'
                )}
              </Button>
            </>
          )}
          {cancelSuccess && (
            <Button 
              variant="primary" 
              onClick={() => {
                setShowCancelModal(false);
                navigate('/bookings');
              }}
            >
              Return to Bookings
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingDetail;
