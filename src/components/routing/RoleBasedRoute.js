import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import roleConfig from "../../utils/roleConfig";

const RoleBasedRoute = ({
  auth: { isAuthenticated, loading, user },
  requiredRole,
  children,
}) => {
  const location = useLocation();

  // For debugging
  // console.log("RoleBasedRoute - Auth State:", {
  //   isAuthenticated,
  //   loading,
  //   user,
  //   requiredRole,
  // });
  // console.log("RoleBasedRoute - Path:", location.pathname);

  if (loading) {
    // console.log("RoleBasedRoute - Loading...");
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // console.log("RoleBasedRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Check if user has required role
  if (user && user.role !== requiredRole) {
    // console.log(
    //   "RoleBasedRoute - User does not have required role:",
    //   user.role,
    //   "required:",
    //   requiredRole
    // );
    return <Navigate to="/unauthorized" />;
  }

  // Check if route is allowed for user's role
  const userRole = user ? user.role : null;
  const path = location.pathname;

  if (userRole && roleConfig[userRole]) {
    const allowedRoutes = roleConfig[userRole].allowedRoutes;
    // console.log(
    //   "RoleBasedRoute - Allowed routes for role",
    //   userRole,
    //   ":",
    //   allowedRoutes
    // );
    // console.log("RoleBasedRoute - Path:", path);
    // console.log("RoleBasedRoute - allowedRoutes:", allowedRoutes);
    const isRouteAllowed = allowedRoutes.some((route) => {
      // Handle route parameters
      if (route.includes(":")) {
        const routeRegex = new RegExp(
          "^" + route.replace(/:[^\s/]+/g, "([\\w-]+)") + "$"
        );
        return routeRegex.test(path);
      }
      return route === path;
    });

    if (!isRouteAllowed) {
      // console.log(
      //   "RoleBasedRoute - Route not allowed for role",
      //   userRole,
      //   ":",
      //   path
      // );
      return <Navigate to="/unauthorized" />;
    }
  }

  // console.log("RoleBasedRoute - Access granted to", path);
  return children;
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(RoleBasedRoute);
