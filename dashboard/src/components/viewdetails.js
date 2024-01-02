import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./viewdetails.css";

const ViewDetails = ({ match }) => {
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    mobile: "",
    image: null,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${match.params.id}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Fetch user details error:", error.message);
      }
    };

    fetchUserDetails();
  }, [match.params.id]);

  return (
    <div className="user-details-container  view-details-container">
      <div className="user-details">
        <h1>User Details</h1>
        <p>Username: {userData.userName}</p>
        <p>Email: {userData.email}</p>
        <p>Phone: {userData.mobile}</p>
      </div>
      {userData.image && (
        <div className="image-card">
          <p>Image:</p>
          <img
            src={`data:${
              userData.image.contentType
            };base64,${userData.image.data.toString("base64")}`}
            alt="User"
          />
        </div>
      )}
      {!userData.image && <p>No image available</p>}
      <div className="links-container">
        <Link to={`/dashboard/${match.params.id}/edit`}>Edit</Link>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default ViewDetails;
