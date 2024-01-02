// LoginForm.js
import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import "./loginform.css";

const LoginForm = ({ setIsOnline, fetchData, onSuccessfulLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        formData
      );

      // Extract the token from the response
      const { token } = response.data;

      // Update the context's isOnline state
      setIsOnline(true);
      setFormData({
        email: "",
        password: "",
      });
      fetchData();

      // Call the onSuccessfulLogin prop with the token
      onSuccessfulLogin(token);

      history.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error.message);
      if (error.response && error.response.status === 401) {
        setIsOnline(false);
      }
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login Form</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          className="login-form-input"
        />
        <br />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                  className="login-form-toggle-button"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          className="login-form-input"
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="login-form-button"
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
