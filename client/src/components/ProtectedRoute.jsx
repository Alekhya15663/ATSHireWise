
import { Navigate,Outlet} from "react-router-dom";

export default function ProtectedRoute({children}) {
  const token = localStorage.getItem("token");
  
  if(!token){
    alert("Login First");
    return <Navigate to ="/login" replace/>;
  }
  return <Outlet/>;
}