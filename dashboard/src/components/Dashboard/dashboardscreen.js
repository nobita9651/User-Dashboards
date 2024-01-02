import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import "./dashboard.css";

const Dashboard = ({ userData, isOnline, fetchData }) => {
  const [filter, setFilter] = useState(localStorage.getItem("filter") || "A-Z");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const history = useHistory();
  const [reloadButton, setReloadButton] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilterAndSort(filter, searchTerm);
    // Save filter to local storage
    localStorage.setItem("filter", filter);
  }, [userData, filter, searchTerm]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const applyFilterAndSort = (selectedFilter, searchTerm = "") => {
    let filteredData = userData
      .filter(
        (user) =>
          (user.userName &&
            user.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.mobile &&
            user.mobile.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        switch (selectedFilter) {
          case "A-Z":
            return a.userName.localeCompare(b.userName);
          case "Z-A":
            return b.userName.localeCompare(a.userName);
          case "LastModified":
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          case "LastInserted":
            return new Date(b.createdAt) - new Date(a.createdAt);
          default:
            return 0;
        }
      });

    setFilteredUsers(filteredData);
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(
        `http://localhost:5000/api/users/${userId}`
      );

      if (response.status === 200) {
        fetchData();
        setSnackbarMessage("User deleted successfully");
        setShowSnackbar(true);
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortAndSearch = () => {
    applyFilterAndSort(filter, searchTerm);
  };

  const handleReload = async () => {
    setReloadButton(true); // Set reloading state
    try {
      await fetchData();
      setShowSnackbar(true);
      setSnackbarMessage("Data reloaded successfully");
    } catch (error) {
      console.error("Reload error:", error.message);
    } finally {
      setTimeout(() => {
        setReloadButton(false); // Reset reloading state after 1 second
      }, 600);
    }
  };

  const handleAddUser = () => {
    // Redirect to the add user page
    history.push("/dashboard/add");
  };

  const handleViewDetails = (userId) => {
    // Redirect to the view details page for the selected user
    history.push(`/dashboard/${userId}`);
  };

  const handleEditUser = (userId) => {
    // Redirect to the edit user page for the selected user
    history.push(`/dashboard/${userId}/edit`);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirmation = () => {
    handleDeleteUser(selectedUserId);
    handleDialogClose();
  };

  return (
    <div className="dashboard-container">
      <div className="filter-bar">
        <select value={filter} onChange={handleFilterChange}>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="LastModified">Last Modified</option>
          <option value="LastInserted">Last Inserted</option>
        </select>
        <TextField
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSortAndSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <IconButton onClick={handleReload}>
          {reloadButton ? <CircularProgress size={20} /> : <RefreshIcon />}
        </IconButton>
      </div>

      <div className="card-container">
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {filteredUsers.length === 0 ? (
          <p>No Data Found</p>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user._id} className="dashboard-card" variant="outlined">
              <CardContent>
                <p>Username: {user.userName}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.mobile}</p>
                <Link to={`/dashboard/${user._id}`}>View Details</Link>
                <IconButton onClick={() => handleEditUser(user._id)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSelectedUserId(user._id);
                    setDialogOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Link to="/dashboard/add" className="floating-button">
        <IconButton>
          <AddIcon />
        </IconButton>
      </Link>

      {/* Snackbar for showing messages */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="success"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this user?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmation} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
