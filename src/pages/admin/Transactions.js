import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Badge,
  Row,
  Col,
  Modal,
  Alert,
  Spinner,
  Tabs,
  Tab,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import {
  getStripeBalance,
  getTransactions,
  getTransactionById,
} from "../../utils/api";
import { formatDate, reactDataTableCustomStyles } from "../../utils/helpers";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [transactionDetailsLoading, setTransactionDetailsLoading] =
    useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch Stripe balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setBalanceLoading(true);
        const data = await getStripeBalance();
        // console.log(data);
        setBalance(data.balance);
        setError(null);
      } catch (err) {
        // console.error("Error fetching Stripe balance:", err);
        setError("Failed to load Stripe balance. Please try again later.");
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, []);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactions(currentPage, itemsPerPage);
        setTransactions(data.data || []);

        // Set pagination data from API response
        setTotalItems(data.total || 0);

        setError(null);
      } catch (err) {
        // console.error("Error fetching transactions:", err);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, itemsPerPage]);

  // View transaction details
  const viewTransactionDetails = async (transaction) => {
    setShowDetailsModal(true);
    setTransactionDetailsLoading(true);
    setSelectedTransaction(transaction);

    try {
      // If we need more details, we can fetch them here
      const data = await getTransactionById(transaction.id);
      setSelectedTransaction(data.data);
    } catch (err) {
      // console.error("Error fetching transaction details:", err);
      setError("Failed to load transaction details. Please try again later.");
    } finally {
      setTransactionDetailsLoading(false);
    }
  };

  // Format amount with currency
  const formatAmount = (amount, currency) => {
    if (!amount) return "N/A";

    // Convert from cents to dollars/etc
    const formattedAmount = amount / 100;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency?.toUpperCase() || "USD",
    }).format(formattedAmount);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "succeeded":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      case "refunded":
        return "info";
      default:
        return "secondary";
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // The transactions will be fetched in the useEffect when currentPage changes
  };

  // DataTable columns
  const columns = [
    {
      name: "Transaction ID",
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => (
        <span className="text-truncate" style={{ maxWidth: "150px" }}>
          {row.id}
        </span>
      ),
    },
    {
      name: "Type",
      selector: (row) => row.payment_method_details?.type || "N/A",
      sortable: true,
      cell: (row) => (
        <Badge bg="secondary" className="text-capitalize">
          {row.payment_method_details?.type || "N/A"}
        </Badge>
      ),
    },
    {
      name: "Currency",
      selector: (row) => row.currency,
      sortable: true,
      cell: (row) => (
        <span className="text-truncate">
          {row.currency?.toUpperCase() || "N/A"}
        </span>
      ),
    },
    {
      name: "Customer",
      selector: (row) => row.customer,
      sortable: true,
      cell: (row) => row.customer || "N/A",
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      cell: (row) => formatAmount(row.amount, row.currency),
    },
    {
      name: "Date",
      selector: (row) => row.created,
      sortable: true,
      cell: (row) => formatDate(row.created),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <Badge bg={getStatusBadgeVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => viewTransactionDetails(row)}
          title="View Transaction Details"
        >
          <i className="fas fa-eye"></i>
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
    data: transactions,
  };

  return (
    <div className="transactions-admin">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Transactions</h2>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Balance Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Available Balance</h6>
                  {balanceLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h3 className="mb-0">
                      {balance?.available
                        ? formatAmount(
                            balance.available[0].amount,
                            balance.available[0].currency
                          )
                        : "N/A"}
                    </h3>
                  )}
                </div>
                <div className="rounded-circle bg-success bg-opacity-10 p-3">
                  <i className="fas fa-wallet text-success fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Pending Balance</h6>
                  {balanceLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h3 className="mb-0">
                      {balance?.pending
                        ? formatAmount(
                            balance.pending[0].amount,
                            balance.pending[0].currency
                          )
                        : "N/A"}
                    </h3>
                  )}
                </div>
                <div className="rounded-circle bg-warning bg-opacity-10 p-3">
                  <i className="fas fa-clock text-warning fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Transactions</h6>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <h3 className="mb-0">{totalItems}</h3>
                  )}
                </div>
                <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                  <i className="fas fa-exchange-alt text-primary fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transactions Table */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          {/* <div className="mb-4">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
            >
              <Tab eventKey="all" title="All Transactions" />
              <Tab eventKey="charge" title="Charges" />
              <Tab eventKey="refund" title="Refunds" />
              <Tab eventKey="payment" title="Payments" />
            </Tabs>
          </div> */}

          <DataTableExtensions
            {...tableData}
            filterPlaceholder="Search transactions..."
          >
            <DataTable
              columns={columns}
              data={transactions}
              noHeader
              defaultSortField="created"
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
                  <p className="mt-2">Loading transactions...</p>
                </div>
              }
              noDataComponent={
                <div className="text-center my-3">
                  <p>No transactions found</p>
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

      {/* Transaction Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="fas fa-receipt me-2"></i>
            Transaction Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {transactionDetailsLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading transaction details...</p>
            </div>
          ) : selectedTransaction ? (
            <div>
              {/* Transaction Summary - Always visible at top */}
              <div className="p-4 border-bottom bg-light">
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="text-muted small">TRANSACTION ID</label>
                      <p className="text-break mb-0 fw-bold">
                        {selectedTransaction.id}
                      </p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <label className="text-muted small">AMOUNT</label>
                      <p className="mb-0 fw-bold">
                        {formatAmount(
                          selectedTransaction.amount,
                          selectedTransaction.currency
                        )}
                      </p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <label className="text-muted small">STATUS</label>
                      <p className="mb-0">
                        <Badge
                          bg={getStatusBadgeVariant(selectedTransaction.status)}
                        >
                          {selectedTransaction.status}
                        </Badge>
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Tabs for different sections */}
              <Tabs defaultActiveKey="transaction" className="mb-0 px-4 pt-3">
                {/* Transaction Info Tab */}
                <Tab
                  eventKey="transaction"
                  title={
                    <span>
                      <i className="fas fa-info-circle me-2"></i>Transaction
                      Info
                    </span>
                  }
                >
                  <div className="p-4">
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="text-muted small">TYPE</label>
                          <p className="mb-0">
                            <Badge bg="secondary" pill>
                              {selectedTransaction.type
                                ? selectedTransaction.type.replace(/_/g, " ")
                                : "Unknown"}
                            </Badge>
                          </p>
                        </div>

                        <div className="mb-3">
                          <label className="text-muted small">DATE</label>
                          <p className="mb-0">
                            {selectedTransaction.created
                              ? formatDate(selectedTransaction.created)
                              : "N/A"}
                          </p>
                        </div>

                        <div className="mb-3">
                          <label className="text-muted small">
                            DESCRIPTION
                          </label>
                          <p className="mb-0">
                            {selectedTransaction.description || "N/A"}
                          </p>
                        </div>

                        {selectedTransaction.receipt_url && (
                          <div className="mb-3">
                            <label className="text-muted small">RECEIPT</label>
                            <p className="mb-0">
                              <a
                                href={selectedTransaction.receipt_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="fas fa-file-invoice me-2"></i>
                                View Receipt
                              </a>
                            </p>
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="text-muted small">CURRENCY</label>
                          <p className="mb-0">
                            {selectedTransaction.currency
                              ? selectedTransaction.currency.toUpperCase()
                              : "N/A"}
                          </p>
                        </div>

                        {selectedTransaction.metadata && (
                          <div className="mb-3">
                            <label className="text-muted small">METADATA</label>
                            <div className="bg-light p-2 rounded">
                              <pre
                                className="mb-0"
                                style={{ fontSize: "0.8rem" }}
                              >
                                {JSON.stringify(
                                  selectedTransaction.metadata,
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </div>
                </Tab>

                {/* Payment Method Tab */}
                <Tab
                  eventKey="payment"
                  title={
                    <span>
                      <i className="fas fa-credit-card me-2"></i>Payment Method
                    </span>
                  }
                >
                  <div className="p-4">
                    {selectedTransaction.payment_method_details &&
                    selectedTransaction.payment_method_details.card ? (
                      <Row>
                        <Col md={6}>
                          <div className="card-preview p-3 border rounded mb-3 bg-white">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div>
                                <i
                                  className={`fab fa-cc-${selectedTransaction.payment_method_details.card.brand.toLowerCase()} fa-2x`}
                                ></i>
                              </div>
                              <div>
                                <span className="text-muted">
                                  {
                                    selectedTransaction.payment_method_details
                                      .card.funding
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="mb-3">
                              <span className="text-muted small">
                                CARD NUMBER
                              </span>
                              <p className="mb-0">
                                •••• •••• ••••{" "}
                                {
                                  selectedTransaction.payment_method_details
                                    .card.last4
                                }
                              </p>
                            </div>
                            <div className="d-flex justify-content-between">
                              <div>
                                <span className="text-muted small">
                                  EXPIRES
                                </span>
                                <p className="mb-0">
                                  {
                                    selectedTransaction.payment_method_details
                                      .card.exp_month
                                  }
                                  /
                                  {
                                    selectedTransaction.payment_method_details
                                      .card.exp_year
                                  }
                                </p>
                              </div>
                              <div>
                                <span className="text-muted small">
                                  COUNTRY
                                </span>
                                <p className="mb-0">
                                  {selectedTransaction.payment_method_details
                                    .card.country || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          {selectedTransaction.payment_method_details.type && (
                            <div className="mb-3">
                              <label className="text-muted small">
                                PAYMENT TYPE
                              </label>
                              <p className="mb-0 text-capitalize">
                                {
                                  selectedTransaction.payment_method_details
                                    .type
                                }
                              </p>
                            </div>
                          )}

                          {selectedTransaction.payment_method_details.card &&
                            selectedTransaction.payment_method_details.card
                              .checks && (
                              <div className="mb-3">
                                <label className="text-muted small">
                                  VERIFICATION CHECKS
                                </label>
                                <ul className="list-group list-group-flush">
                                  {Object.entries(
                                    selectedTransaction.payment_method_details
                                      .card.checks
                                  ).map(([key, value]) => (
                                    <li
                                      key={key}
                                      className="list-group-item bg-transparent px-0 py-1 border-0"
                                    >
                                      <span className="text-capitalize">
                                        {key.replace(/_/g, " ")}:{" "}
                                      </span>
                                      <Badge
                                        bg={
                                          value === "pass"
                                            ? "success"
                                            : value === "fail"
                                            ? "danger"
                                            : "secondary"
                                        }
                                        pill
                                      >
                                        {value}
                                      </Badge>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </Col>
                      </Row>
                    ) : (
                      <div className="text-center py-4">
                        <p>No payment method details available</p>
                      </div>
                    )}
                  </div>
                </Tab>

                {/* Customer Info Tab */}
                <Tab
                  eventKey="customer"
                  title={
                    <span>
                      <i className="fas fa-user me-2"></i>Customer Info
                    </span>
                  }
                >
                  <div className="p-4">
                    {selectedTransaction.billing_details ? (
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <label className="text-muted small">NAME</label>
                            <p className="mb-0">
                              {selectedTransaction.enhanced_billing_details
                                .name || "N/A"}
                            </p>
                          </div>

                          <div className="mb-3">
                            <label className="text-muted small">EMAIL</label>
                            <p className="mb-0">
                              {selectedTransaction.enhanced_billing_details
                                .email ? (
                                <a
                                  href={`mailto:${selectedTransaction.enhanced_billing_details.email}`}
                                >
                                  {
                                    selectedTransaction.enhanced_billing_details
                                      .email
                                  }
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </p>
                          </div>

                          <div className="mb-3">
                            <label className="text-muted small">PHONE</label>
                            <p className="mb-0">
                              {selectedTransaction.enhanced_billing_details
                                .phone ? (
                                <a
                                  href={`tel:${selectedTransaction.enhanced_billing_details.phone}`}
                                >
                                  {
                                    selectedTransaction.enhanced_billing_details
                                      .phone
                                  }
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </p>
                          </div>
                        </Col>
                        <Col md={6}>
                          {selectedTransaction.enhanced_billing_details
                            .address && (
                            <div className="mb-3">
                              <label className="text-muted small">
                                ADDRESS
                              </label>
                              <address className="mb-0">
                                {selectedTransaction.enhanced_billing_details
                                  .address.line1 && (
                                  <>
                                    {
                                      selectedTransaction
                                        .enhanced_billing_details.address.line1
                                    }
                                    <br />
                                  </>
                                )}
                                {selectedTransaction.enhanced_billing_details
                                  .address.line2 && (
                                  <>
                                    {
                                      selectedTransaction
                                        .enhanced_billing_details.address.line2
                                    }
                                    <br />
                                  </>
                                )}
                                {selectedTransaction.enhanced_billing_details
                                  .address.city && (
                                  <>
                                    {
                                      selectedTransaction
                                        .enhanced_billing_details.address.city
                                    }
                                    ,{" "}
                                  </>
                                )}
                                {selectedTransaction.enhanced_billing_details
                                  .address.state && (
                                  <>
                                    {
                                      selectedTransaction.billing_details
                                        .address.state
                                    }{" "}
                                  </>
                                )}
                                {selectedTransaction.enhanced_billing_details
                                  .address.postal_code && (
                                  <>
                                    {
                                      selectedTransaction
                                        .enhanced_billing_details.address
                                        .postal_code
                                    }
                                    <br />
                                  </>
                                )}
                                {selectedTransaction.enhanced_billing_details
                                  .address.country && (
                                  <>
                                    {
                                      selectedTransaction
                                        .enhanced_billing_details.address
                                        .country
                                    }
                                  </>
                                )}
                              </address>
                            </div>
                          )}
                        </Col>
                      </Row>
                    ) : (
                      <div className="text-center py-4">
                        <p>No customer details available</p>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-4">
              <p>Transaction details not found</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
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

export default Transactions;
