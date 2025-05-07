import React, { useState, useEffect } from "react";
import { Card, Badge, Row, Col, Alert, Spinner } from "react-bootstrap";
import { getUserReviews } from "../../utils/api";
import { formatDate } from "../../utils/helpers";
import StarRating from "../common/StarRating";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getUserReviews();
        
        if (!response?.data) {
          throw new Error("Invalid response format from server");
        }

        setReviews(response.data || []);
      } catch (err) {
        console.error("Error fetching user reviews:", err);
        setError(
          "Failed to load your reviews: " +
            (err.response?.data?.message ||
              err.message ||
              "Unknown error occurred")
        );
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, []);

  // Get status badge variant
  const getStatusBadgeVariant = (approved) => {
    if (approved === true) return "success";
    if (approved === false) return "danger";
    return "warning";
  };

  // Get status text
  const getStatusText = (approved) => {
    if (approved === true) return "Approved";
    if (approved === false) return "Rejected";
    return "Pending";
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-3">
        {error}
      </Alert>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center p-5">
          <i className="bi bi-star fa-3x text-muted mb-3"></i>
          <h5>No Reviews Yet</h5>
          <p className="text-muted">
            You haven't submitted any reviews yet. Share your experiences with the packages you've booked!
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="user-reviews">
      <h4 className="mb-3">My Reviews</h4>
      
      {reviews.map((review) => (
        <Card key={review._id} className="border-0 shadow-sm mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 className="mb-1">{review.title}</h5>
                <p className="text-muted mb-1">
                  <small>
                    For: <strong>{review.package?.title}</strong> • {formatDate(review.createdAt)}
                  </small>
                </p>
                <div className="d-flex align-items-center">
                  <StarRating rating={review.rating} />
                  <span className="ms-2 text-muted">
                    {review.rating} out of 5
                  </span>
                </div>
              </div>
              <Badge
                bg={getStatusBadgeVariant(review.approved)}
                className="text-capitalize"
              >
                {getStatusText(review.approved)}
              </Badge>
            </div>
            
            <p className="mb-3">{review.text}</p>
            
            {review.images && review.images.length > 0 && (
              <Row className="g-2 mt-2">
                {review.images.map((image, index) => (
                  <Col key={index} xs={6} md={4} lg={3}>
                    <img
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="img-thumbnail"
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                ))}
              </Row>
            )}
            
            {review.approved === false && (
              <Alert variant="danger" className="mt-3 mb-0">
                <small>
                  <i className="bi bi-info-circle me-2"></i>
                  Your review was not approved. This could be due to inappropriate content or not meeting our review guidelines.
                </small>
              </Alert>
            )}
            
            {review.approved === null && (
              <Alert variant="warning" className="mt-3 mb-0">
                <small>
                  <i className="bi bi-clock me-2"></i>
                  Your review is pending approval. This usually takes 24-48 hours.
                </small>
              </Alert>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default UserReviews;
