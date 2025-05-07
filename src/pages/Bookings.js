import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Tabs,
  Tab,
  Spinner,
} from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { getUserBookings, getCurrentUser } from "../utils/api";
import { formatDate } from "../utils/helpers";

const Bookings = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getUserBookings();
        setBookings(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again.");
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }

  if (authLoading || loading) {
    return (
      <div className="py-5 text-center">
        <Container>
          <Spinner animation="border" variant="primary" />
          <h2 className="mt-3">Loading bookings...</h2>
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

  // Filter bookings based on active tab
  const getFilteredBookings = () => {
    if (!bookings || bookings.length === 0) return [];

    if (activeTab === "all") return bookings;
    return bookings.filter((booking) => booking.status === activeTab);
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="py-5">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="display-4 fw-bold mb-3">My Bookings</h1>
              <p className="lead">View and manage all your tour bookings</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Card className="border-0 mb-4">
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              <Tab eventKey="all" title="All Bookings" />
              <Tab eventKey="confirmed" title="Confirmed" />
              <Tab eventKey="pending" title="Pending" />
              <Tab eventKey="cancelled" title="Cancelled" />
            </Tabs>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <h4>No bookings found</h4>
                <p className="text-muted">
                  {activeTab === "all"
                    ? "You haven't made any bookings yet."
                    : `You don't have any ${activeTab} bookings.`}
                </p>
                <Button
                  as={Link}
                  to="/packages"
                  variant="primary"
                  className="mt-3"
                >
                  Explore Packages
                </Button>
              </div>
            ) : (
              <div className="d-grid gap-4">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking._id || booking.id}
                    booking={booking}
                    getStatusVariant={getStatusVariant}
                    getPaymentVariant={getPaymentVariant}
                  />
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

// Booking Card Component
const BookingCard = ({ booking, getStatusVariant, getPaymentVariant }) => {
  return (
    <Card className="border-0 shadow-lg">
      <Card.Body className="p-0">
        <Row className="g-0">
          <Col md={3} style={{ height: "250px" }}>
            <img
              src={
                booking.packageImage ||
                booking.package?.images?.[0] ||
                "https://source.unsplash.com/random/300x200/?travel"
              }
              alt={booking.packageName || booking.package?.title}
              className="img-fluid rounded-start "
              style={{ height: "100%", width: "100%" }}
            />
          </Col>
          <Col md={9}>
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4 className="mb-1">
                    {booking.packageName || booking.package?.title}
                  </h4>
                  <p className="text-muted mb-0">
                    <small>Booking ID: {booking._id || booking.id}</small>
                  </p>
                </div>
                <div className="d-flex">
                  <span
                    className={`badge bg-${getStatusVariant(
                      booking.status
                    )} me-2`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                  <span
                    className={`badge bg-${getPaymentVariant(
                      booking.paymentStatus
                    )}`}
                  >
                    {booking.paymentStatus.charAt(0).toUpperCase() +
                      booking.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>

              <Row className="mb-3">
                <Col sm={6}>
                  <p className="mb-1">
                    <i className="far fa-calendar-alt me-2 text-primary"></i>
                    <strong>Travel Dates:</strong>
                  </p>
                  <p className="ms-4 mb-0">
                    Booking Date: {formatDate(booking.bookingDate)}
                  </p>
                </Col>
                <Col sm={6}>
                  <p className="mb-1">
                    <i className="fas fa-users me-2 text-primary"></i>
                    <strong>Travelers:</strong>
                  </p>
                  <p className="ms-4 mb-0">{booking.persons || 2} persons</p>
                </Col>
              </Row>

              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-primary">
                  Rs. {booking.totalAmount.toLocaleString()}
                </h5>
                <div>
                  {booking.status === "pending" && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        // Cancel booking functionality would go here
                        alert(
                          "Cancel booking functionality not implemented yet"
                        );
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    as={Link}
                    to={`/bookings/${booking._id || booking.id}`}
                    variant="primary"
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Bookings;
