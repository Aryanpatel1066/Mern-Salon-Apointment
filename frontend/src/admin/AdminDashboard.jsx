import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminDashboard(){
      const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("You have logged out successfully!", { autoClose: 2000 });
        navigate("/login");
      };
    return(
        <>
         <h1>AdminDashboard page</h1>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
        </>
    )
}
export default AdminDashboard;