import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Badge,
  Form,
  Row,
  Col,
  Modal,
  Spinner,
  Alert,
  InputGroup,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getAllBookingsAdmin, updateBookingStatus } from "../../utils/api";
import { formatDate, reactDataTableCustomStyles } from "../../utils/helpers";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateId, setStatusUpdateId] = useState(null);
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAllBookingsAdmin(currentPage, itemsPerPage);

        if (!response?.data) {
          throw new Error("Invalid response format from server");
        }

        let filteredBookings = response.data || [];

        // Apply status filter if not "all"
        if (activeTab !== "all") {
          filteredBookings = filteredBookings.filter(
            (booking) => booking.status === activeTab
          );
        }

        // Apply date filter if set
        if (dateFilter.startDate && dateFilter.endDate) {
          const startDate = new Date(dateFilter.startDate);
          const endDate = new Date(dateFilter.endDate);
          endDate.setHours(23, 59, 59, 999); // Set to end of day

          filteredBookings = filteredBookings.filter((booking) => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate >= startDate && bookingDate <= endDate;
          });
        }

        // Apply search query if set
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredBookings = filteredBookings.filter(
            (booking) =>
              booking.user?.name?.toLowerCase().includes(query) ||
              booking.user?.email?.toLowerCase().includes(query) ||
              booking.package?.title?.toLowerCase().includes(query) ||
              booking._id?.toLowerCase().includes(query)
          );
        }

        setBookings(filteredBookings);
        setTotalItems(response.total || 0);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(
          "Failed to load bookings: " +
            (err.response?.data?.message ||
              err.message ||
              "Unknown error occurred")
        );
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage, itemsPerPage, activeTab, dateFilter, searchQuery]);

  // View booking details
  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  // Update booking status
  const handleUpdateBookingStatus = async (id, newStatus) => {
    // Set updating status to true to prevent multiple updates at once
    setUpdatingStatus(true);
    setStatusUpdateId(id);
    try {
      // Call the API function from utils/api.js to update the booking status
      await updateBookingStatus(id, newStatus);

      // Update local state with the new status
      setBookings(
        bookings.map((booking) =>
          booking._id === id ? { ...booking, status: newStatus } : booking
        )
      );

      // If the selected booking is being updated, update the modal data too
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      setError("Failed to update booking status. Please try again later.");
    } finally {
      setUpdatingStatus(false);
      setStatusUpdateId(null);
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "completed":
        return "info";
      default:
        return "secondary";
    }
  };

  // Format price
  const formatPrice = (price) => {
    return `Rs. ${Number(price).toLocaleString()}`;
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // DataTable columns
  const columns = [
    {
      name: "Booking ID",
      selector: (row) => row._id,
      sortable: true,
      cell: (row) => (
        <div className="text-truncate" style={{ maxWidth: "240px" }}>
          {row._id}
        </div>
      ),
    },
    {
      name: "Package",
      selector: (row) => row.package?.title,
      sortable: true,
      cell: (row) => (
        <div>
          <h6 className="mb-0">{row.package?.title || "N/A"}</h6>
          <small className="text-muted">{row.package?.location || ""}</small>
        </div>
      ),
    },
    {
      name: "Customer",
      selector: (row) => row.user?.name,
      sortable: true,
      cell: (row) => (
        <div>
          <h6 className="mb-0">{row.user?.name || "N/A"}</h6>
          <small className="text-muted">{row.user?.email || "N/A"}</small>
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row) => row.totalAmount,
      sortable: true,
      cell: (row) => formatPrice(row.totalAmount),
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
          {row.status}
        </Badge>
      ),
    },
    {
      name: "Date",
      selector: (row) => row.bookingDate,
      sortable: true,
      cell: (row) => formatDate(row.bookingDate),
    },
    {
      name: "View",
      cell: (row) => (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => viewBookingDetails(row)}
          title="View Booking Details"
        >
          <i className="fas fa-eye"></i>
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Confirm",
      cell: (row) => (
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => handleUpdateBookingStatus(row._id, "confirmed")}
          title="Confirm Booking"
          disabled={row.status !== "pending" || (updatingStatus && statusUpdateId === row._id)}
        >
          {updatingStatus && statusUpdateId === row._id ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <i className="fas fa-check"></i>
          )}
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Complete",
      cell: (row) => (
        <Button
          variant="outline-info"
          size="sm"
          onClick={() => handleUpdateBookingStatus(row._id, "completed")}
          title="Mark as Completed"
          disabled={row.status !== "confirmed" || (updatingStatus && statusUpdateId === row._id)}
        >
          {updatingStatus && statusUpdateId === row._id ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <i className="fas fa-flag-checkered"></i>
          )}
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Cancel",
      cell: (row) => (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleUpdateBookingStatus(row._id, "cancelled")}
          title="Cancel Booking"
          disabled={!(row.status === "pending" || row.status === "confirmed") || (updatingStatus && statusUpdateId === row._id)}
        >
          {updatingStatus && statusUpdateId === row._id ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <i className="fas fa-times"></i>
          )}
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
    data: bookings,
  };

  return (
    <div className="bookings-admin p-4">
      <h2 className="mb-4">Booking Management</h2>

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

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="py-3">
          <Row className="align-items-center mb-3">
            <Col md={8}>
              <div className="d-flex align-items-center flex-wrap">
                <Button
                  variant={activeTab === "all" ? "primary" : "outline-primary"}
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveTab("all")}
                >
                  All Bookings
                </Button>
                <Button
                  variant={
                    activeTab === "pending" ? "warning" : "outline-warning"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveTab("pending")}
                >
                  <i className="bi bi-hourglass me-1"></i>
                  Pending
                </Button>
                <Button
                  variant={
                    activeTab === "confirmed" ? "success" : "outline-success"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveTab("confirmed")}
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Confirmed
                </Button>
                <Button
                  variant={activeTab === "completed" ? "info" : "outline-info"}
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setActiveTab("completed")}
                >
                  <i className="bi bi-flag-fill me-1"></i>
                  Completed
                </Button>
                <Button
                  variant={
                    activeTab === "cancelled" ? "danger" : "outline-danger"
                  }
                  size="sm"
                  className="mb-2 mb-md-0"
                  onClick={() => setActiveTab("cancelled")}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Cancelled
                </Button>
              </div>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex justify-content-md-end">
                <Form.Select
                  className="me-2"
                  style={{ width: "80px" }}
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </Form.Select>
                <span className="mt-2">per page</span>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-2 mb-md-0">
              <Form.Group>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => setSearchQuery("")}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Row>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Control
                      type="date"
                      placeholder="Start Date"
                      value={dateFilter.startDate}
                      onChange={(e) =>
                        setDateFilter({
                          ...dateFilter,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="d-flex">
                    <Form.Control
                      type="date"
                      placeholder="End Date"
                      value={dateFilter.endDate}
                      onChange={(e) =>
                        setDateFilter({
                          ...dateFilter,
                          endDate: e.target.value,
                        })
                      }
                    />
                    {(dateFilter.startDate || dateFilter.endDate) && (
                      <Button
                        variant="outline-secondary"
                        className="ms-2"
                        onClick={() =>
                          setDateFilter({ startDate: "", endDate: "" })
                        }
                      >
                        <i className="bi bi-x"></i>
                      </Button>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Bookings Table */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <DataTableExtensions
            {...tableData}
            filterPlaceholder="Search bookings..."
          >
            <DataTable
              columns={columns}
              data={bookings}
              noHeader
              defaultSortField="travelDate"
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
                  <p className="mt-2">Loading bookings...</p>
                </div>
              }
              noDataComponent={
                <div className="text-center my-3">
                  <p>No bookings found</p>
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

      {/* Booking Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="fas fa-calendar-check me-2"></i>
            Booking Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking ? (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="border-0 mb-4">
                    <Card.Body>
                      <h5 className="mb-3">Booking Information</h5>
                      <p className="mb-2">
                        <strong>Booking ID:</strong> {selectedBooking._id}
                      </p>
                      <p className="mb-2">
                        <strong>Package:</strong>{" "}
                        {selectedBooking.package?.title}
                      </p>
                      <p className="mb-2">
                        <strong>Travel Date:</strong>{" "}
                        {formatDate(selectedBooking.travelDate)}
                      </p>
                      <p className="mb-2">
                        <strong>Adults:</strong> {selectedBooking.adults}
                      </p>
                      <p className="mb-2">
                        <strong>Children:</strong> {selectedBooking.children}
                      </p>
                      <p className="mb-0">
                        <strong>Status:</strong>{" "}
                        <Badge
                          bg={getStatusBadgeVariant(selectedBooking.status)}
                          className="text-capitalize"
                        >
                          {selectedBooking.status}
                        </Badge>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 mb-4">
                    <Card.Body>
                      <h5 className="mb-3">Customer Information</h5>
                      <p className="mb-2">
                        <strong>Name:</strong>{" "}
                        {selectedBooking.user?.name || "N/A"}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong>{" "}
                        {selectedBooking.user?.email || "N/A"}
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong>{" "}
                        {selectedBooking.user?.phone || "N/A"}
                      </p>
                      <p className="mb-0">
                        <strong>Booking Date:</strong>{" "}
                        {formatDate(selectedBooking.createdAt)}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="border-0 mb-0">
                <Card.Body>
                  <h5 className="mb-3">Payment Information</h5>
                  <p className="mb-2">
                    <strong>Amount:</strong>{" "}
                    {formatPrice(selectedBooking.amount)}
                  </p>
                  <p className="mb-2">
                    <strong>Payment Status:</strong>{" "}
                    <Badge
                      bg={
                        selectedBooking.paymentStatus === "paid"
                          ? "success"
                          : "warning"
                      }
                    >
                      {selectedBooking.paymentStatus || "Pending"}
                    </Badge>
                  </p>
                  <p className="mb-0">
                    <strong>Payment Method:</strong>{" "}
                    {selectedBooking.paymentMethod || "Card"}
                  </p>
                </Card.Body>
              </Card>
            </div>
          ) : (
            <div className="text-center py-4">
              <p>Booking details not found</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedBooking && selectedBooking.status === "pending" && (
            <Button
              variant="success"
              onClick={() =>
                handleUpdateBookingStatus(selectedBooking._id, "confirmed")
              }
              disabled={updatingStatus}
              title="Confirm Booking"
            >
              {updatingStatus && statusUpdateId === selectedBooking._id ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-2"></i>
                  Confirm Booking
                </>
              )}
            </Button>
          )}
          {selectedBooking && selectedBooking.status === "confirmed" && (
            <Button
              variant="info"
              onClick={() =>
                handleUpdateBookingStatus(selectedBooking._id, "completed")
              }
              disabled={updatingStatus}
              title="Mark as Completed"
            >
              {updatingStatus && statusUpdateId === selectedBooking._id ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-flag-checkered me-2"></i>
                  Mark as Completed
                </>
              )}
            </Button>
          )}
          {selectedBooking &&
            (selectedBooking.status === "pending" ||
              selectedBooking.status === "confirmed") && (
              <Button
                variant="danger"
                onClick={() =>
                  handleUpdateBookingStatus(selectedBooking._id, "cancelled")
                }
                disabled={updatingStatus}
                title="Cancel Booking"
              >
                {updatingStatus && statusUpdateId === selectedBooking._id ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-times me-2"></i>
                    Cancel Booking
                  </>
                )}
              </Button>
            )}
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
            title="Close Modal"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Bookings;
