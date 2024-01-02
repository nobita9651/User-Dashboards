// EditUser.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./edituser.css";

const EditUser = ({ match, fetchData }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    mobile: "",
  });

  const history = useHistory();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${match.params.id}`
        );
        setFormData({
          userName: response.data.userName,
          email: response.data.email,
          mobile: response.data.mobile,
        });
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };

    fetchUserDetails();
  }, [match.params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/users/${match.params.id}`,
        formData
      );

      console.log("Edit user success:", response.data);
      fetchData(); // Refresh data after editing
      history.push("/dashboard"); // Redirect to the dashboard
    } catch (error) {
      console.error("Edit user error:", error.message);
    }
  };

  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>
      <form className="edit-user-form" onSubmit={handleSubmit}>
        <label htmlFor="userName">Username:</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="Username"
        />
        <label htmlFor="userName">Email:</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <label htmlFor="userName">Mobile:</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile"
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditUser;
