import React from "react";
import { FaSignOutAlt, FaClipboardList, FaWrench } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./chefPage.css"; // Using the same CSS file for consistent styling

const TechnicienPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // Navigation function to problem list
  const navigateToProblemList = () => {
    const technicienId = user?.id || "unknown";
    window.open( `http://localhost:5174/technicien-problems?technicienId=${technicienId}`,'_blank');
  };

  return (
    <div className="chef-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2><FaWrench className="icon" /> Technicien Dashboard</h2>

        <div className="sidebar-menu">
          <button onClick={navigateToProblemList} className="active">
            <FaClipboardList className="icon" /> Problem List
          </button>
          {/* Logout button */}
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt className="icon" /> Logout
          </button>
        </div>

        {/* User info at the bottom */}
        <div className="user-info">
          <div className="profile-section">
            <div className="avatar">{user?.name?.charAt(0) || "T"}</div>
            <div className="user-details">
              <h3>{user?.name || "Technicien Name"}</h3>
              <p>{user?.email || "technicien@example.com"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicienPage;