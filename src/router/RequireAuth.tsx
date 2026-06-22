import { Navigate } from "react-router-dom";
import { useContext, type JSX } from "react";
import { AuthContext } from "../context/AuthContext";

type RequireAuthTypes = { 
  children: JSX.Element;
  roles?: string[];
};

const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useContext(AuthContext); 
  
 
  console.log("Logged In User:", user); 
  console.log("Allowed Roles:", roles);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

 
  const hasAccess = roles?.some((role) => 
    user?.roles?.some((userRole: string) => userRole.toUpperCase() === role.toUpperCase())
  );

  if (roles && !hasAccess) {
    return <div>Access Denied</div>;
  }

  return children;
};

export default RequireAuth;