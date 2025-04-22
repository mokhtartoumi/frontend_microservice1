import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "./AdminPage.css";
import AdminDashboard from "./components/admindashboard";
import CreateUser from "./components/CreateUser";
import UpdateUser from "./components/UpdateUser";
import DeleteUser from "./components/DeleteUser";
import AssignChefToAssistant from "./components/AssignChefToAssistant";
import logo from "./photo/logoagilenergy.jpg";

const AdminPage = ({ user, setUser }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "user",
    place: "",
    section: "",
    speciality: "",
    nationality: "",
  });
  const [activeMenu, setActiveMenu] = useState("createUser");
  const [searchAddress, setSearchAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    // Verify user is actually admin
    if (user?.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchAddressChange = (e) => {
    setSearchAddress(e.target.value);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    applyRoleFilter(e.target.value);
  };

  const applyRoleFilter = (role) => {
    if (role === "all") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => user.role === role);
      setFilteredUsers(filtered);
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post("http://localhost:3000/users", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert("User created successfully: " + response.data.message);
      getAllUsers(); // Refresh the list
    } catch (error) {
      console.error("Error creating user:", error);
      alert(error.response?.data?.error || "Failed to create user");
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
      setRoleFilter("all");
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const getUserById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const updateUser = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("User updated successfully: " + response.data.message);
      getAllUsers(); // Refresh the list
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.response?.data?.error || "Failed to update user");
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert("User deleted successfully: " + response.data.message);
      getAllUsers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.error || "Failed to delete user");
    }
  };

  const searchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users?search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.data.length > 0) {
        setFormData(response.data[0]);
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error("Error searching user:", error);
      alert("Failed to search user");
    }
  };

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const showDashboard = () => {
    setActiveMenu("dashboard");
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <h2>Menu</h2>
        <button onClick={() => setActiveMenu("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveMenu("createUser")}>Create User</button>
        <button onClick={() => setActiveMenu("updateUser")}>Update User</button>
        <button onClick={() => setActiveMenu("deleteUser")}>Delete User</button>
        <button onClick={() => window.open("http://localhost:5174/predefined", "_blank")}> Create Problem </button>

        
        <button onClick={() => setActiveMenu("assignChefToAssistant")}>
          Assign Chef to Assistant
        </button>
        <button
          onClick={() => {
            setActiveMenu("allUsers");
            getAllUsers();
          }}
        >
          All Users
        </button>
        
        <div className="logout-icon" onClick={handleLogout}>
          <FaSignOutAlt size={24} />
        </div>

        <div className="admin-info-section">
          <div className="admin-info-divider"></div>
          <div className="admin-info-content">
            <p className="admin-role">{user?.role?.toUpperCase() || "ADMIN"}</p>
            <p className="admin-name">{user?.name || "Administrator"}</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        <h1>Admin Dashboard</h1>

        {activeMenu === "dashboard" && <AdminDashboard />}
          

        {activeMenu === "createUser" && (
          <CreateUser
            formData={formData}
            handleInputChange={handleInputChange}
            createUser={createUser}
          />
        )}

        {activeMenu === "updateUser" && (
          <UpdateUser
            formData={formData}
            handleInputChange={handleInputChange}
            handleSearchQueryChange={handleSearchQueryChange}
            searchUser={searchUser}
            updateUser={updateUser}
            searchQuery={searchQuery}
          />
        )}
        

        {activeMenu === "deleteUser" && (
          <DeleteUser 
            searchQuery={searchQuery}
            handleSearchQueryChange={handleSearchQueryChange}
            searchUser={searchUser}
            deleteUser={deleteUser}
          />
        )}

        {activeMenu === "assignChefToAssistant" && <AssignChefToAssistant />}

        {activeMenu === "allUsers" && (
          <div className="all-users-container">
            <h2>All Users</h2>
            <div className="filter-controls">
              <label htmlFor="roleFilter">Filter by Role: </label>
              <select
                id="roleFilter"
                value={roleFilter}
                onChange={handleRoleFilterChange}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="chef">Chef</option>
                <option value="assistant">Assistant</option>
                <option value="technicien">Technicien</option>
              </select>
            </div>
            <div className="scrollable-users-list">
              <ul>
                {filteredUsers.map((user) => (
                  <li key={user.id}>
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                      <span className="user-role">{user.role}</span>
                      {user.place && <span className="user-place">{user.place}</span>}
                      {user.section && <span className="user-section">{user.section}</span>}
                      {user.speciality && <span className="user-speciality">{user.speciality}</span>}
                    </div>
                    <div className="user-actions">
                      <button onClick={() => getUserById(user.id)}>View</button>
                      <button onClick={() => deleteUser(user.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;