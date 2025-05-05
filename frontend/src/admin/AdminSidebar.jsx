 // AdminSidebar.jsx
import { Link, Outlet } from "react-router-dom";

function AdminSidebar() {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <nav style={{ width: "200px", background: "#f0f0f0", padding: "1rem" }}>
                <h2>Admin Panel</h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li><Link to="/admin/dashboard">Dashboard</Link></li>
                    <li><Link to="/admin/services">Service Management</Link></li>
                    <li><Link to="/admin/users">User Management</Link></li>
                    <li><Link to="/admin/bookings">Booking Management</Link></li>
                </ul>
            </nav>
            <main style={{ flex: 1, padding: "1rem"}}>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminSidebar;
