import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Badge,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
  Modal,
  Tab,
  Tabs,
  InputGroup,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getAllContactsAdmin, replyToContact } from "../../utils/api";
import { formatDate, reactDataTableCustomStyles } from "../../utils/helpers";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [activeStatus, setActiveStatus] = useState("all");
  const [success, setSuccess] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);

      try {
        const status = activeStatus !== "all" ? activeStatus : null;
        const response = await getAllContactsAdmin(
          status,
          currentPage,
          itemsPerPage
        );

        if (!response?.data) {
          throw new Error("Invalid response format from server");
        }

        setContacts(response.data || []);
        setTotalItems(response.total || 0);
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError(
          "Failed to load contacts: " +
            (err.response?.data?.message ||
              err.message ||
              "Unknown error occurred")
        );
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [activeStatus, refreshData, currentPage, itemsPerPage]);

  // Handle sending reply
  const handleSendReply = async () => {
    if (
      !replyText ||
      typeof replyText !== "string" ||
      !replyText.trim() ||
      !selectedContact
    )
      return;

    setSendingReply(true);
    setError(null);

    try {
      // Call the API to send the reply
      const response = await replyToContact(selectedContact._id, replyText);

      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      console.log("Reply sent successfully:", response.data);

      // Update local state
      setContacts(
        contacts.map((contact) =>
          contact._id === selectedContact._id
            ? {
                ...contact,
                status: "replied",
                reply: replyText,
                repliedAt: new Date().toISOString(),
              }
            : contact
        )
      );

      // Update selected contact
      setSelectedContact({
        ...selectedContact,
        status: "replied",
        reply: replyText,
        repliedAt: new Date().toISOString(),
      });

      // Clear reply text
      setReplyText("");

      // Show success message
      setError(null);
      setSuccess("Reply sent successfully!");

      // Close modal after a short delay
      setTimeout(() => {
        handleModalClose();
      }, 2000);
    } catch (err) {
      console.error("Error sending reply:", err);
      setError(
        "Failed to send reply: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setSendingReply(false);
    }
  };

  // View contact details
  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    // Fix for [object Object] issue - ensure we're setting a string
    if (contact.reply) {
      if (typeof contact.reply === "object" && contact.reply.text) {
        setReplyText(contact.reply.text);
      } else if (typeof contact.reply === "string") {
        setReplyText(contact.reply);
      } else {
        setReplyText("");
      }
    } else {
      setReplyText("");
    }
    setShowModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedContact(null);
    setReplyText("");
    // Refresh data when modal is closed
    setRefreshData((prev) => !prev);
  };

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

  const getStatusLabel = (status) => {
    switch (status) {
      case "unread":
        return "Unread";
      case "read":
        return "Read";
      case "replied":
        return "Replied";
      default:
        return "Unknown";
    }
  };

  // DataTable columns
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div>
          <h6 className="mb-0">{row.name}</h6>
          <small className="text-muted">{row.email}</small>
        </div>
      ),
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <Badge
          bg={getStatusBadgeVariant(row.status)}
          className="text-capitalize"
        >
          {getStatusLabel(row.status)}
        </Badge>
      ),
    },
    {
      name: "Date",
      selector: (row) => row.createdAt,
      sortable: true,
      cell: (row) => formatDate(row.createdAt),
    },
    {
      name: "View",
      cell: (row) => (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleViewContact(row)}
          title="View Message"
        >
          <i className="bi bi-envelope-open"></i>
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Reply",
      cell: (row) => (
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => handleViewContact(row)}
          title="Reply"
          disabled={row.status === "replied"}
        >
          <i className="bi bi-reply"></i>
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // DataTable configuration
  const tableData = {
    columns,
    data: contacts,
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="contacts-admin p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">Contact Management</h2>
      </div>

      {error && (
        <Alert
          variant="danger"
          className="mb-4"
          dismissible
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          variant="success"
          className="mb-4"
          dismissible
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="py-3">
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center flex-wrap">
                <Button
                  variant={
                    activeStatus === "all" ? "primary" : "outline-primary"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveStatus("all")}
                >
                  All Messages
                </Button>
                <Button
                  variant={
                    activeStatus === "unread" ? "danger" : "outline-danger"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveStatus("unread")}
                >
                  <i className="bi bi-envelope me-1"></i>
                  Unread
                </Button>
                <Button
                  variant={
                    activeStatus === "read" ? "warning" : "outline-warning"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveStatus("read")}
                >
                  <i className="bi bi-envelope-open me-1"></i>
                  Read
                </Button>
                <Button
                  variant={
                    activeStatus === "replied" ? "success" : "outline-success"
                  }
                  size="sm"
                  className="mb-2 mb-md-0"
                  onClick={() => setActiveStatus("replied")}
                >
                  <i className="bi bi-reply me-1"></i>
                  Replied
                </Button>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex justify-content-md-end">
                <span className="me-3">
                  <i className="bi bi-envelope me-1"></i> Total:{" "}
                  {totalItems || 0}
                </span>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Contacts Table */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          {/* <Row className="mb-4">
            <Col md={8}>
              <div className="d-flex align-items-center flex-wrap">
                <Button
                  variant={
                    activeStatus === "all" ? "primary" : "outline-primary"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveStatus("all")}
                >
                  All Messages
                </Button>
                <Button
                  variant={
                    activeStatus === "unread" ? "danger" : "outline-danger"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveStatus("unread")}
                >
                  Unread
                </Button>
                <Button
                  variant={
                    activeStatus === "read" ? "warning" : "outline-warning"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveStatus("read")}
                >
                  Read
                </Button>
                <Button
                  variant={
                    activeStatus === "replied" ? "success" : "outline-success"
                  }
                  size="sm"
                  className="mb-2 mb-md-0"
                  onClick={() => setActiveStatus("replied")}
                >
                  Replied
                </Button>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex justify-content-md-end">
                <span className="me-3">
                  <i className="bi bi-envelope me-1"></i> Total:{" "}
                  {totalItems || 0}
                </span>
              </div>
            </Col>
          </Row> */}

          <DataTableExtensions
            {...tableData}
            filterPlaceholder="Search messages..."
            print={false}
            export={false}
          >
            <DataTable
              columns={columns}
              data={contacts}
              noHeader
              defaultSortField="createdAt"
              defaultSortAsc={false}
              pagination
              paginationServer
              paginationTotalRows={totalItems}
              paginationPerPage={itemsPerPage}
              paginationComponentOptions={{
                rowsPerPageText: "Rows per page:",
                rangeSeparatorText: "of",
                noRowsPerPage: false,
                selectAllRowsItem: false,
                selectAllRowsItemText: "All",
              }}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={(perPage) => {
                setItemsPerPage(perPage);
                setCurrentPage(1);
              }}
              progressPending={loading}
              progressComponent={
                <div className="text-center my-3">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading messages...</p>
                </div>
              }
              noDataComponent={
                <div className="text-center my-3">
                  <p>No messages found</p>
                </div>
              }
              customStyles={reactDataTableCustomStyles}
              highlightOnHover
              pointerOnHover
              responsive
            />
          </DataTableExtensions>
        </Card.Body>
      </Card>

      {/* Contact Detail Modal */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Contact Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {selectedContact && (
            <>
              <div className="p-3 bg-light rounded-1 mb-4 border-start border-5 border-primary">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">{selectedContact.subject}</h4>
                  <Badge
                    bg={getStatusBadgeVariant(selectedContact.status)}
                    className="px-3 py-2"
                  >
                    {getStatusLabel(selectedContact.status)}
                  </Badge>
                </div>
                <div className="contact-info mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <div className="contact-icon me-2">
                      <i className="bi bi-person-circle text-primary"></i>
                    </div>
                    <p className="mb-0">
                      <strong>From:</strong> {selectedContact.name} (
                      {selectedContact.email})
                    </p>
                  </div>

                  {selectedContact.phone && (
                    <div className="d-flex align-items-center mb-2">
                      <div className="contact-icon me-2">
                        <i className="bi bi-telephone text-primary"></i>
                      </div>
                      <p className="mb-0">
                        <strong>Phone:</strong> {selectedContact.phone}
                      </p>
                    </div>
                  )}

                  <div className="d-flex align-items-center">
                    <div className="contact-icon me-2">
                      <i className="bi bi-calendar-date text-primary"></i>
                    </div>
                    <p className="mb-0">
                      <strong>Date:</strong>{" "}
                      {formatDate(selectedContact.createdAt)}
                    </p>
                  </div>
                </div>

                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-primary text-white">
                    <i className="bi bi-chat-left-text me-2"></i>
                    Message
                  </Card.Header>
                  <Card.Body className="bg-white">
                    <p className="mb-0">{selectedContact.message}</p>
                  </Card.Body>
                </Card>

                {selectedContact.status === "replied" &&
                  selectedContact.reply && (
                    <div className="mb-4">
                      <h6 className="mb-2 d-flex align-items-center">
                        <i className="bi bi-reply-fill text-success me-2"></i>
                        Your Reply
                      </h6>
                      <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-success text-white">
                          <div className="d-flex justify-content-between align-items-center">
                            <span>
                              <i className="bi bi-check-circle me-2"></i>Sent
                              Reply
                            </span>
                            <small>
                              {formatDate(
                                selectedContact.reply?.date ||
                                  selectedContact.updatedAt
                              )}
                            </small>
                          </div>
                        </Card.Header>
                        <Card.Body className="bg-light">
                          <p className="mb-0">
                            {typeof selectedContact.reply === "object"
                              ? selectedContact.reply?.text
                              : selectedContact.reply}
                          </p>
                        </Card.Body>
                      </Card>
                    </div>
                  )}

                {selectedContact.status !== "replied" && (
                  <div>
                    <h6 className="mb-2 d-flex align-items-center">
                      <i className="bi bi-reply-fill text-primary me-2"></i>
                      Reply to this message
                    </h6>
                    <Card className="border-0 shadow-sm">
                      <Card.Body>
                        <Form.Group className="mb-0">
                          <Form.Control
                            as="textarea"
                            rows={5}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply here..."
                            className="border-primary"
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedContact && selectedContact.status !== "replied" && (
            <Button
              variant="primary"
              onClick={handleSendReply}
              disabled={
                sendingReply ||
                !replyText ||
                typeof replyText !== "string" ||
                !replyText.trim()
              }
              className="px-4"
            >
              {sendingReply ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Send Reply
                </>
              )}
            </Button>
          )}
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Contacts;
