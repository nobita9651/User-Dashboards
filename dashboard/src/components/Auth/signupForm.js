import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./signupform.css";
import {
  IconButton,
  InputAdornment,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SignupForm = ({ fetchData }) => {
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    hearAbout: [],
    city: "Mumbai",
    state: "Maharashtra",
    password: "",
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "city") {
      setFormData({
        ...formData,
        [name]: value,
        state: getStateForCity(value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getStateForCity = (city) => {
    switch (city) {
      case "Mumbai":
      case "Pune":
        return "Maharashtra";
      case "Ahmedabad":
        return "Gujarat";
      case "Bangalore": // Handle the case where none of the cities is selected
        return "Karnataka";
      default:
        return "";
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      hearAbout: checked
        ? [...prevData.hearAbout, name]
        : prevData.hearAbout.filter((item) => item !== name),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data:", formData); // Log formData
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        formData
      );
      fetchData();
      console.log("User signed up:", response.data);

      // Redirect to "/dashboard" after successful signup
      history.push("/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Display the error message to the user
        alert(error.response.data.message);
      } else {
        console.error("Signup error:", error.message);
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        {/* <br /> */}
        <TextField
          label="Email"
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
        />

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
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {/* <br /> */}
        <TextField
          label="Phone"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          required
        />
        {/* <br /> */}
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            row
            aria-label="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="Female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel
              value="Others"
              control={<Radio />}
              label="Others"
            />
          </RadioGroup>
        </FormControl>
        {/* <br /> */}
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">How did you hear about this?</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.hearAbout.includes("LinkedIn")}
                onChange={handleCheckboxChange}
                name="LinkedIn"
              />
            }
            label="LinkedIn"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.hearAbout.includes("Friends")}
                onChange={handleCheckboxChange}
                name="Friends"
              />
            }
            label="Friends"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.hearAbout.includes("JobPortal")}
                onChange={handleCheckboxChange}
                name="JobPortal"
              />
            }
            label="Job Portal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.hearAbout.includes("Others")}
                onChange={handleCheckboxChange}
                name="Others"
              />
            }
            label="Others"
          />
        </FormControl>
        {/* <br /> */}
        <FormControl fullWidth>
          <FormLabel component="legend">City</FormLabel>
          <Select
            name="city"
            value={formData.city}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Mumbai">Mumbai</MenuItem>
            <MenuItem value="Pune">Pune</MenuItem>
            <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
            <MenuItem value="Bangalore">Bangalore</MenuItem>
          </Select>
        </FormControl>
        {/* <br /> */}
        <TextField
          label="State"
          type="text"
          name="state"
          value={formData.state}
          readOnly
          fullWidth
        />
        {/* <br /> */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupForm;
