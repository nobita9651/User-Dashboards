import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  useHistory,
} from "react-router-dom";
import axios from "axios";
import Dashboard from "./components/Dashboard/dashboardscreen";
import SignupLogin from "./components/Auth/login";
import AddUser from "./components/Adduser";
import ViewDetails from "./components/viewdetails";
import EditUser from "./components/Edituser";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./App.css";

const Navbar = ({ isOnline, setIsOnline, loggedIn, setLoggedIn }) => {
  const history = useHistory();

  const handleLogout = () => {
    // Add logic to clear user session or perform logout actions
    setIsOnline(false);
    setLoggedIn(false);
    localStorage.removeItem("authToken");
    history.push("/"); // Redirect to login page on logout
  };

  return (
    <nav>
      <Link to="/dashboard" className="navbar-title">
        2D Dashboard
      </Link>
      <Link to="/dashboard">Home</Link>
      <Link to="/dashboard/add">Add User</Link>
      <Link to="/About">About Us</Link>
      <Link to="/Help">Contact Us</Link>
      <Link to="/Faqs">FAQs</Link>
      {isOnline ? (
        <button onClick={handleLogout}>
          <ExitToAppIcon />
        </button>
      ) : (
        <Link to="/">Login/Signup</Link>
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer>
      <p>&copy; 2023 2D Dashboard. All rights reserved.</p>
    </footer>
  );
};

const App = () => {
  const [userData, setUserData] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineSnackbarOpen, setOfflineSnackbarOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // Added state for checking authentication status
  const history = useHistory();

  // Function to check authentication status from local storage
  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setLoggedIn(true);
    }
    setCheckingAuth(false); // Update state after checking authentication
  };

  useEffect(() => {
    fetchData();
    checkAuth(); // Call checkAuth to set the initial login state
  }, []); // Empty dependency array means this effect runs once on mount

  const fetchData = async () => {
    try {
      if (!navigator.onLine) {
        setIsOnline(false);
        setOfflineSnackbarOpen(true);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/users");
      const data = response.data;

      // Update the state with the fetched data
      setUserData(data);
      setIsOnline(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsOnline(false);
    }
  };

  const handleOfflineSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOfflineSnackbarOpen(false);
  };

  if (checkingAuth) {
    // Render loading or a splash screen while checking authentication
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div className="form-box">
            <SignupLogin
              setIsOnline={setIsOnline}
              fetchData={fetchData}
              setLoggedIn={setLoggedIn}
            />
          </div>
        </Route>
        <Route path="/dashboard">
          {!loggedIn ? (
            <Redirect to="/" />
          ) : (
            <>
              <Navbar
                isOnline={isOnline}
                setIsOnline={setIsOnline}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
              />
              <div className="container">
                <Switch>
                  <Route path="/dashboard/add">
                    <AddUser fetchData={fetchData} />
                  </Route>
                  <Route path="/dashboard/:id/edit">
                    <Route
                      path="/dashboard/:id/edit"
                      render={(props) => (
                        <EditUser
                          {...props}
                          userData={userData}
                          fetchData={fetchData}
                        />
                      )}
                    />
                  </Route>
                  <Route path="/dashboard/:id">
                    <Route
                      path="/dashboard/:id"
                      render={(props) => <ViewDetails {...props} />}
                    />
                  </Route>
                  <Route path="/dashboard">
                    <Dashboard
                      userData={userData}
                      isOnline={isOnline}
                      fetchData={fetchData}
                    />
                  </Route>
                </Switch>
              </div>
              <Footer />
            </>
          )}
        </Route>
      </Switch>
      <Snackbar
        open={offlineSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleOfflineSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleOfflineSnackbarClose}
          severity="warning"
        >
          Please enable Wi-Fi or Mobile Data to access the application.
        </MuiAlert>
      </Snackbar>
    </Router>
  );
};

export default App;
