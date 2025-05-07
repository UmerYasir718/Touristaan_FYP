import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Badge,
  Form,
  Row,
  Col,
  Modal,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getAllAdminPayments, updatePaymentStatus } from "../../utils/api";
import { formatDate, reactDataTableCustomStyles } from "../../utils/helpers";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateId, setStatusUpdateId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAllAdminPayments(currentPage, itemsPerPage);

        if (!response?.data) {
          throw new Error("Invalid response format from server");
        }

        let filteredPayments = response.data || [];

        // Apply status filter if not "all"
        if (statusFilter !== "all") {
          filteredPayments = filteredPayments.filter(
            (payment) => payment.status === statusFilter
          );
        }

        // Apply date filter if set
        if (dateFilter.startDate && dateFilter.endDate) {
          const startDate = new Date(dateFilter.startDate);
          const endDate = new Date(dateFilter.endDate);
          endDate.setHours(23, 59, 59, 999); // Set to end of day

          filteredPayments = filteredPayments.filter((payment) => {
            const paymentDate = new Date(payment.createdAt);
            return paymentDate >= startDate && paymentDate <= endDate;
          });
        }

        // Apply search query if set
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredPayments = filteredPayments.filter(
            (payment) =>
              payment.user?.name?.toLowerCase().includes(query) ||
              payment.user?.email?.toLowerCase().includes(query) ||
              payment.booking?.package?.title?.toLowerCase().includes(query) ||
              payment._id?.toLowerCase().includes(query) ||
              payment.paymentMethod?.toLowerCase().includes(query)
          );
        }

        setPayments(filteredPayments);
        setTotalItems(response.total || 0);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(
          "Failed to load payments: " +
            (err.response?.data?.message ||
              err.message ||
              "Unknown error occurred")
        );
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [currentPage, itemsPerPage, statusFilter, dateFilter, searchQuery]);

  // View payment details
  const viewPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  // Update payment status
  const handleUpdatePaymentStatus = async (paymentId, newStatus) => {
    try {
      setUpdatingStatus(true);
      setStatusUpdateId(paymentId);

      const response = await updatePaymentStatus(paymentId, newStatus);

      // Update the payment in the list
      setPayments(
        payments.map((payment) =>
          payment._id === paymentId ? response.data : payment
        )
      );

      // If the payment is currently selected in the modal, update it
      if (selectedPayment && selectedPayment._id === paymentId) {
        setSelectedPayment(response.data);
      }

      // Show success message
      setError(null);
    } catch (err) {
      console.error("Error updating payment status:", err);
      setError(`Failed to update payment status: ${err.message}`);
    } finally {
      setUpdatingStatus(false);
      setStatusUpdateId(null);
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "succeeded":
        return "success";
      case "pending":
        return "warning";
      case "refunded":
        return "info";
      case "failed":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Format amount
  const formatAmount = (amount) => {
    if (!amount) return "N/A";
    return `Rs. ${amount.toLocaleString() || "0"}`;
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // DataTable columns
  const columns = [
    {
      name: "Payment ID",
      selector: (row) => row._id,
      sortable: true,
      cell: (row) => (
        <div className="text-truncate" style={{ maxWidth: "240px" }}>
          {row._id}
        </div>
      ),
    },
    {
      name: "Customer",
      selector: (row) => row?.customerName,
      sortable: true,
      cell: (row) => (
        <div>
          <h6 className="mb-0">{row?.customerName || "N/A"}</h6>
          <small className="text-muted">{row?.customerEmail || "N/A"}</small>
        </div>
      ),
    },
    {
      name: "Package",
      selector: (row) => row.booking?.packageName,
      sortable: true,
      cell: (row) => (
        <div>
          <h6 className="mb-0">{row.booking?.packageName || "N/A"}</h6>
          {/* <small className="text-muted">
            {row.booking?.package?.location || ""}
          </small> */}
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      cell: (row) => formatAmount(row.amount),
    },
    {
      name: "Method",
      selector: (row) => row.paymentMethod,
      sortable: true,
      cell: (row) => (
        <Badge bg="info" className="text-capitalize">
          {row.paymentMethod}
        </Badge>
      ),
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
          onClick={() => viewPaymentDetails(row)}
          title="View Payment Details"
        >
          <i className="fas fa-eye"></i>
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Mark as Paid",
      cell: (row) => (
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => handleUpdatePaymentStatus(row._id, "succeeded")}
          title="Mark as Paid"
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
      name: "Mark as Refunded",
      cell: (row) => (
        <Button
          variant="outline-info"
          size="sm"
          onClick={() => handleUpdatePaymentStatus(row._id, "refunded")}
          title="Mark as Refunded"
          disabled={row.status !== "succeeded" || (updatingStatus && statusUpdateId === row._id)}
        >
          {updatingStatus && statusUpdateId === row._id ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <i className="fas fa-undo"></i>
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
    data: payments,
  };

  return (
    <div className="payments-admin p-4">
      <h2 className="mb-4">Payment Management</h2>

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
                  variant={
                    statusFilter === "all" ? "primary" : "outline-primary"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setStatusFilter("all")}
                >
                  All Payments
                </Button>
                <Button
                  variant={
                    statusFilter === "pending" ? "warning" : "outline-warning"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setStatusFilter("pending")}
                >
                  <i className="bi bi-hourglass me-1"></i>
                  Pending
                </Button>
                <Button
                  variant={
                    statusFilter === "succeeded" ? "success" : "outline-success"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setStatusFilter("succeeded")}
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Succeeded
                </Button>
                <Button
                  variant={
                    statusFilter === "failed" ? "danger" : "outline-danger"
                  }
                  size="sm"
                  className="me-2 mb-2 mb-md-0"
                  onClick={() => setStatusFilter("failed")}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Failed
                </Button>
                <Button
                  variant={
                    statusFilter === "refunded"
                      ? "secondary"
                      : "outline-secondary"
                  }
                  size="sm"
                  className="mb-2 mb-md-0"
                  onClick={() => setStatusFilter("refunded")}
                >
                  <i className="bi bi-arrow-return-left me-1"></i>
                  Refunded
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
                    placeholder="Search payments..."
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

      {/* Payments Table */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <DataTableExtensions
            {...tableData}
            filterPlaceholder="Search payments..."
          >
            <DataTable
              columns={columns}
              data={payments}
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
                  <p className="mt-2">Loading payments...</p>
                </div>
              }
              noDataComponent={
                <div className="text-center my-3">
                  <p>No payments found</p>
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

      {/* Payment Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="fas fa-receipt me-2"></i>
            Payment Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div>
              <Card className="border-0 bg-light mb-3">
                <Card.Body>
                  <h5 className="mb-3">Transaction Information</h5>
                  <p className="mb-2">
                    <strong>Payment ID:</strong> {selectedPayment._id}
                  </p>
                  <p className="mb-2">
                    <strong>Booking ID:</strong>{" "}
                    {selectedPayment.booking?._id || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Amount:</strong>{" "}
                    {formatAmount(selectedPayment.amount)}
                  </p>
                  <p className="mb-2">
                    <strong>Date:</strong>{" "}
                    {formatDate(selectedPayment.createdAt)}
                  </p>
                  <p className="mb-2">
                    <strong>Method:</strong>{" "}
                    {selectedPayment.paymentMethod || "Card"}
                  </p>
                  <p className="mb-0">
                    <strong>Status:</strong>{" "}
                    <Badge bg={getStatusBadgeVariant(selectedPayment.status)}>
                      {selectedPayment.status}
                    </Badge>
                  </p>
                </Card.Body>
              </Card>

              <Card className="border-0 mb-3">
                <Card.Body>
                  <h5 className="mb-3">Booking Information</h5>
                  <p className="mb-2">
                    <strong>Package:</strong>{" "}
                    {selectedPayment.booking?.package?.title || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Travel Date:</strong>{" "}
                    {formatDate(selectedPayment.booking?.travelDate)}
                  </p>
                  <p className="mb-2">
                    <strong>Adults:</strong>{" "}
                    {selectedPayment.booking?.adults || "0"}
                  </p>
                  <p className="mb-2">
                    <strong>Children:</strong>{" "}
                    {selectedPayment.booking?.children || "0"}
                  </p>
                  <p className="mb-0">
                    <strong>Status:</strong>{" "}
                    <Badge
                      bg={getStatusBadgeVariant(
                        selectedPayment.booking?.status
                      )}
                    >
                      {selectedPayment.booking?.status || "N/A"}
                    </Badge>
                  </p>
                </Card.Body>
              </Card>

              <Card className="border-0 mb-0">
                <Card.Body>
                  <h5 className="mb-3">Customer Information</h5>
                  <p className="mb-2">
                    <strong>Name:</strong>{" "}
                    {selectedPayment.booking?.user?.name || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong>{" "}
                    {selectedPayment.booking?.user?.email || "N/A"}
                  </p>
                  <p className="mb-0">
                    <strong>Phone:</strong>{" "}
                    {selectedPayment.booking?.user?.phone || "N/A"}
                  </p>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedPayment && selectedPayment.status === "pending" && (
            <Button
              variant="success"
              onClick={() =>
                handleUpdatePaymentStatus(selectedPayment._id, "succeeded")
              }
              disabled={updatingStatus}
              title="Mark as Paid"
            >
              {updatingStatus && statusUpdateId === selectedPayment._id ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-2"></i>
                  Mark as Paid
                </>
              )}
            </Button>
          )}
          {selectedPayment && selectedPayment.status === "succeeded" && (
            <Button
              variant="info"
              onClick={() =>
                handleUpdatePaymentStatus(selectedPayment._id, "refunded")
              }
              disabled={updatingStatus}
              title="Mark as Refunded"
            >
              {updatingStatus && statusUpdateId === selectedPayment._id ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-undo me-2"></i>
                  Mark as Refunded
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

export default Payments;
