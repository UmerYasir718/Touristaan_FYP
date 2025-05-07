import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Button, Card, Badge, Spinner } from "react-bootstrap";
import { getUserContacts } from "../../utils/api";
import { formatDate } from "../../utils/helpers";

const UserMessagesModal = ({ show, onHide, updateUnreadCount }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const fetchingRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Function to fetch user messages - with safeguards against duplicate calls
  const fetchUserMessages = useCallback(async () => {
    // // Prevent duplicate API calls
    // if (fetchingRef.current || !isMountedRef.current || !show) return;

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await getUserContacts();
      console.log(response);
      // Safety check for component unmount during API call
      // if (!isMountedRef.current) return;

      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      setMessages(response.data || []);

      // Calculate unread messages for the header badge
      if (updateUnreadCount) {
        const unreadCount = response.data.filter(
          (message) =>
            message.status === "replied" || message.status === "unread"
        ).length;
        updateUnreadCount(unreadCount);
      }
    } catch (err) {
      // Safety check for component unmount during API call
      if (!isMountedRef.current) return;

      console.error("Error fetching user messages:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load your messages. Please try again."
      );
    } finally {
      // if (isMountedRef.current) {
      setLoading(false);
      // }
      // fetchingRef.current = false;
    }
  }, [show, updateUnreadCount]);

  // Only fetch messages when modal is shown
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (show) {
      // Fetch messages immediately when modal opens
      fetchUserMessages();

      // Set up polling only when modal is visible
      intervalRef.current = setInterval(() => {
        fetchUserMessages();
      }, 30000); // Check every 30 seconds
    }

    // Cleanup interval when modal closes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [show, fetchUserMessages]);

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "replied":
        return "success";
      case "read":
        return "warning";
      case "unread":
      default:
        return "secondary";
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case "replied":
        return "Replied";
      case "read":
        return "Read";
      case "unread":
      default:
        return "Unread";
    }
  };

  // Manually refresh messages
  const handleRefresh = () => {
    if (!fetchingRef.current) {
      fetchUserMessages();
    }
  };

  // Handle modal close with cleanup
  const handleClose = () => {
    // Update unread count before closing
    if (messages.length > 0 && updateUnreadCount) {
      const unreadCount = messages.filter(
        (message) => message.status === "replied" || message.status === "unread"
      ).length;
      updateUnreadCount(unreadCount);
    }

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Call the parent's onHide function
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-envelope me-2 text-primary"></i>
          My Messages
        </Modal.Title>
        <Button
          variant="outline-primary"
          size="sm"
          className="ms-3"
          onClick={handleRefresh}
          disabled={loading || fetchingRef.current}
          title="Refresh Messages"
        >
          <i className="fas fa-sync-alt"></i>
        </Button>
      </Modal.Header>
      <Modal.Body className="p-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading your messages...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
            <h5>No Messages Yet</h5>
            <p className="text-muted">
              You haven't sent any messages yet. Visit the contact page to get
              in touch with us.
            </p>
            <Button variant="primary" href="/contact" onClick={onHide}>
              Contact Us
            </Button>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((message) => (
              <Card
                key={message._id}
                className="mb-3 border-0"
                style={{
                  boxShadow:
                    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0">{message.subject}</h5>
                    <Badge bg={getStatusBadgeVariant(message.status)}>
                      {getStatusLabel(message.status)}
                    </Badge>
                  </div>
                  <p className="text-muted mb-1 small">
                    <i className="far fa-calendar-alt me-1"></i>
                    {formatDate(message.createdAt)}
                  </p>
                  <p className="mb-3">{message.message}</p>

                  {message.status === "replied" && message.reply && (
                    <div className="admin-reply mt-3 p-3 bg-light rounded">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-reply text-primary me-2"></i>
                        <h6 className="mb-0">Admin Reply</h6>
                        <small className="ms-2 text-muted">
                          {message.repliedAt && formatDate(message.repliedAt)}
                        </small>
                      </div>
                      <p className="mb-0">
                        {typeof message.reply === "string"
                          ? message.reply
                          : message.reply?.text ||
                            "Thank you for your message. We'll get back to you soon."}
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserMessagesModal;
