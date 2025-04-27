// import { Navigate, Outlet, useLocation } from "react-router";

// const ProtectedRoute = () => {
//   const location = useLocation();

//   // Fetch user role from localStorage
//   const userRole = localStorage.getItem("userRole");

//   // Redirect unauthenticated users to login
//   if (!userRole) return <Navigate to="/login-page" state={{ from: location }} replace />;

//   // Define restricted routes based on roles
//   const restrictedRoutes = {
//     admin: [
//       "/side-bar/add-locations", "/side-bar/adduser", "/side-bar/view-users", 
//       "/side-bar/view-profile", "/side-bar/manage-namuna", "/side-bar/all-payments"
//     ],
//     farmer: [
//       "/side-bar/namuna-7", "/side-bar/noc", "/side-bar/application", 
//       "/side-bar/farm-profile", "/side-bar/submitted-forms", "/side-bar/submitted-noc", 
//       "/side-bar/submitted-exemption", "/side-bar/payments"
//     ],
//     talati: [
//       "/side-bar/approve-deny-noc", "/side-bar/approve-deny-exemption", 
//       "/side-bar/view-noc", "/side-bar/view-exemption", "/side-bar/view-namuna", 
//       "/side-bar/all-payments"
//     ],
//     karkoon: ["/side-bar/form12"],
//     chowkidar: ["/side-bar/view-form12"],
//     engineer: ["/side-bar/approve-deny-form12"]
//   };

//   // Check if the user is unauthorized for a certain route
//   for (const [role, routes] of Object.entries(restrictedRoutes)) {
//     if (routes.some((route) => location.pathname.includes(route)) && userRole !== role && !['admin', 'talati','karkoon','engineer'].includes(userRole)) {
//       return <Navigate to="/side-bar/dashboard" replace />;
//     }
//   }
//   return <Outlet />;
// };

// export default ProtectedRoute;


import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoute = () => {
  const location = useLocation();

  // Fetch user role from localStorage
  const userRole = localStorage.getItem("userRole");

  // Redirect unauthenticated users to login
  if (!userRole) return <Navigate to="/login-page" state={{ from: location }} replace />;

  // Define restricted routes based on roles
  const restrictedRoutes = {
    admin: ["/side-bar/add-locations", "/side-bar/adduser","/side-bar/view-users", "/side-bar/view-profile","/side-bar/manage-namuna"],
    farmer: ["/side-bar/namuna-7", "/side-bar/noc", "/side-bar/application","side-bar/farm-profile","/side-bar/submitted-forms","/side-bar/submitted-noc","/side-bar/submitted-exemption","/side-bar/payments"],
    talati: ["/side-bar/approve-deny-noc","/side-bar/approve-deny-exemption","/side-bar/view-noc","/side-bar/view-exemption","/side-bar/view-namuna"],
    karkoon: ["/side-bar/form12"],
    chowkidar:["/side-bar/view-form12"],
    engineer:["/side-bar/approve-deny-form12"]
    
  };

  // Check if the user is unauthorized for a certain route
  for (const [role, routes] of Object.entries(restrictedRoutes)) {
    if (routes.some((route) => location.pathname.includes(route)) && userRole !== role) {
      return <Navigate to="/side-bar/dashboard" replace />;
    }
  }
  return <Outlet />;
};

export default ProtectedRoute;

