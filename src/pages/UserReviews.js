import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import UserReviewsComponent from "../components/reviews/UserReviews";

const UserReviews = () => {
  return (
    <div className="user-reviews-page py-5">
      <Container>
        <Row>
          <Col lg={10} className="mx-auto">
            <h2 className="mb-4">My Reviews</h2>
            <p className="text-muted mb-4">
              View all your submitted reviews and their approval status.
            </p>
            <UserReviewsComponent />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserReviews;
