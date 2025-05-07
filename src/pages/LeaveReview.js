import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { connect } from "react-redux";
import { submitReview } from "../utils/api";

const LeaveReview = ({ auth: { user } }) => {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    packageId: "",
    title: "",
    content: "",
    name: "",
    email: "",
  });

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare review data
      const reviewData = {
        ...formData,
        rating,
        userId: user ? user._id : null,
      };

      // Submit review to backend
      await submitReview(reviewData);

      // Reset form and show success message
      setFormData({
        packageId: "",
        title: "",
        content: "",
        name: user ? user.name : "",
        email: user ? user.email : "",
      });
      setRating(0);
      setSubmitted(true);

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="display-4 fw-bold mb-3">Share Your Experience</h1>
              <p className="lead">
                Your feedback helps us improve and assists other travelers in
                making informed decisions.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8}>
            <Card className="border-0 ">
              <Card.Body
                className="p-4"
                style={{
                  boxShadow:
                    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                }}
              >
                <h3 className="fw-bold mb-4 text-center">Leave a Review</h3>

                {submitted && (
                  <Alert variant="success" className="mb-4">
                    <i className="fas fa-check-circle me-2"></i>
                    Thank you for your review! Your feedback is valuable to us
                    and future travelers.
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="reviewTour">
                    <Form.Label>Select Tour Package</Form.Label>
                    <Form.Select
                      className="shadow-sm"
                      required
                      name="packageId"
                      value={formData.packageId}
                      onChange={handleChange}
                    >
                      <option value="">Select the tour you experienced</option>
                      <option value="swat">Swat Valley Adventure</option>
                      <option value="kashmir">Kashmir Paradise Tour</option>
                      <option value="naran">Naran Kaghan Expedition</option>
                      <option value="islamabad">Islamabad City Tour</option>
                      <option value="lahore">Historical Lahore Tour</option>
                      <option value="karachi">
                        Karachi Coastal Experience
                      </option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="reviewName">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your Name"
                      required
                      className="shadow-sm"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="reviewEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Your Email"
                      required
                      className="shadow-sm"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      Your email will not be published. It's only for
                      verification purposes.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="reviewRating">
                    <Form.Label>Rating</Form.Label>
                    <div className="d-flex align-items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`fas fa-star fa-2x me-2 ${
                            rating >= star ? "text-warning" : "text-muted"
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setRating(star)}
                        ></i>
                      ))}
                      <span className="ms-2 text-muted">
                        {rating > 0
                          ? `${rating} out of 5 stars`
                          : "Click to rate"}
                      </span>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="reviewTitle">
                    <Form.Label>Review Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Summarize your experience in a short title"
                      required
                      className="shadow-sm"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="reviewMsg">
                    <Form.Label>Your Review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Share your experience in detail. What did you enjoy? What could be improved?"
                      required
                      className="shadow-sm"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="reviewPhotos">
                    <Form.Label>Share Photos (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      accept="image/*"
                      className="shadow-sm"
                    />
                    <Form.Text className="text-muted">
                      You can upload up to 5 photos from your tour experience.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="reviewConsent">
                    <Form.Check
                      type="checkbox"
                      label="I confirm this is a genuine review based on my personal experience"
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      className="px-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Submit Review
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Reviews Section */}
        <Row>
          <Col lg={12} className="text-center mb-4">
            <h2 className="fw-bold">Recent Reviews</h2>
            <p className="lead">
              See what other travelers are saying about their experiences
            </p>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="border-0 shadow-lg h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Amazing Swat Valley Tour</h5>
                  <div className="text-warning">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
                <p className="text-muted mb-3">
                  <small>By Ahmed Khan - April 15, 2025</small>
                </p>
                <p>
                  "The Swat Valley tour exceeded all my expectations! The
                  natural beauty was breathtaking, and our guide was extremely
                  knowledgeable. The accommodations were comfortable, and the
                  food was delicious. Highly recommend!"
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="border-0 shadow-lg h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Wonderful Kashmir Experience</h5>
                  <div className="text-warning">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="far fa-star"></i>
                  </div>
                </div>
                <p className="text-muted mb-3">
                  <small>By Sara Ali - March 28, 2025</small>
                </p>
                <p>
                  "Kashmir truly is paradise on earth! The tour was
                  well-organized, and we got to see all the major attractions.
                  The only reason for 4 stars instead of 5 is that the trip felt
                  a bit rushed at times. Otherwise, it was perfect!"
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="border-0 shadow-lg h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Memorable Lahore Tour</h5>
                  <div className="text-warning">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                </div>
                <p className="text-muted mb-3">
                  <small>By Fatima Malik - May 2, 2025</small>
                </p>
                <p>
                  "The historical Lahore tour was fascinating! Our guide was
                  very knowledgeable about the city's rich history and culture.
                  The food tour included in the package was an absolute
                  highlight. Would definitely book again!"
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(LeaveReview);
