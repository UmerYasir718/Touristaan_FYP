// Role-based access control configuration
const roleConfig = {
  admin: {
    allowedRoutes: [
      "/admin",
      "/admin/dashboard",
      "/admin/bookings",
      "/admin/packages",
      "/admin/users",
      "/admin/payments",
      "/admin/transactions",
      "/admin/settings",
      "/admin/reviews",
      "/admin/contacts",
    ],
  },
  user: {
    allowedRoutes: [
      "/profile",
      "/bookings",
      "/bookings/:id",
      "/leave-review",
      "/packages",
      "/packagesDetail",
      "/checkout/:id",
      "/my-reviews",
      "/my-messages",
      "/contact",
    ],
  },
};

export default roleConfig;
