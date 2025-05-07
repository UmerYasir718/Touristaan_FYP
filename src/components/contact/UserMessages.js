import React, { useState, useEffect } from "react";
import { Card, Badge, Alert, Spinner } from "react-bootstrap";
import { getUserContacts } from "../../utils/api";
import { formatDate } from "../../utils/helpers";

const UserMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getUserContacts();
        
        if (!response?.data) {
          throw new Error("Invalid response format from server");
        }

        setMessages(response.data || []);
      } catch (err) {
        // console.error("Error fetching user messages:", err);
        setError(
          "Failed to load your messages: " +
            (err.response?.data?.message ||
              err.message ||
              "Unknown error occurred")
        );
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMessages();
  }, []);

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "unread":
        return "danger";
      case "read":
        return "warning";
      case "replied":
        return "success";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your messages...</p>
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

  if (messages.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center p-5">
          <i className="bi bi-envelope fa-3x text-muted mb-3"></i>
          <h5>No Messages Yet</h5>
          <p className="text-muted">
            You haven't sent any messages yet. Visit our contact page to get in touch!
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="user-messages">
      <h4 className="mb-3">My Messages</h4>
      
      {messages.map((message) => (
        <Card key={message._id} className="border-0 shadow-sm mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 className="mb-1">{message.subject}</h5>
                <p className="text-muted mb-0">
                  <small>Sent on {formatDate(message.createdAt)}</small>
                </p>
              </div>
              <Badge
                bg={getStatusBadgeVariant(message.status)}
                className="text-capitalize"
              >
                {message.status}
              </Badge>
            </div>
            
            <Card className="bg-light mb-3">
              <Card.Body>
                <p className="mb-0">{message.message}</p>
              </Card.Body>
            </Card>
            
            {message.status === "replied" && message.reply && (
              <div>
                <h6 className="mb-2">
                  <i className="bi bi-reply me-2"></i>
                  Response from our team
                </h6>
                <Card className="border-primary border-start border-4">
                  <Card.Body>
                    <p className="mb-1">{message.reply}</p>
                    <small className="text-muted">
                      Replied on {formatDate(message.repliedAt)}
                    </small>
                  </Card.Body>
                </Card>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default UserMessages;
