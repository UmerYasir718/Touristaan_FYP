import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import UserMessagesComponent from "../components/contact/UserMessages";

const UserMessages = () => {
  return (
    <div className="user-messages-page py-5">
      <Container>
        <Row>
          <Col lg={10} className="mx-auto">
            <h2 className="mb-4">My Messages</h2>
            <p className="text-muted mb-4">
              View all your contact messages and responses from our team.
            </p>
            <UserMessagesComponent />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserMessages;
