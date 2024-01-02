import React, { useState } from "react";
import userService from "../../services/userServices";

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [hearAbout, setHearAbout] = useState([]);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = {
        name,
        email,
        phone,
        gender,
        hearAbout,
        city,
        state,
      };

      const response = await userService.signupUser(userData);

      if (!response.success) {
        throw new Error(response.error);
      }

      // Handle success, show message, redirect, etc.
      console.log("User signed up successfully");
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <label htmlFor="email">Email:</label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <label htmlFor="phone">Phone:</label>
      <input
        type="text"
        id="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />

      <label>Gender:</label>
      <input
        type="radio"
        id="male"
        value="male"
        checked={gender === "male"}
        onChange={() => setGender("male")}
      />
      <label htmlFor="male">Male</label>

      <input
        type="radio"
        id="female"
        value="female"
        checked={gender === "female"}
        onChange={() => setGender("female")}
      />
      <label htmlFor="female">Female</label>

      <input
        type="radio"
        id="others"
        value="others"
        checked={gender === "others"}
        onChange={() => setGender("others")}
      />
      <label htmlFor="others">Others</label>

      <label>How did you hear about this?</label>
      <input
        type="checkbox"
        id="linkedin"
        value="linkedin"
        checked={hearAbout.includes("linkedin")}
        onChange={() => setHearAbout([...hearAbout, "linkedin"])}
      />
      <label htmlFor="linkedin">LinkedIn</label>

      <input
        type="checkbox"
        id="friends"
        value="friends"
        checked={hearAbout.includes("friends")}
        onChange={() => setHearAbout([...hearAbout, "friends"])}
      />
      <label htmlFor="friends">Friends</label>

      <input
        type="checkbox"
        id="jobportal"
        value="jobportal"
        checked={hearAbout.includes("jobportal")}
        onChange={() => setHearAbout([...hearAbout, "jobportal"])}
      />
      <label htmlFor="jobportal">Job Portal</label>

      <input
        type="checkbox"
        id="othersHear"
        value="others"
        checked={hearAbout.includes("others")}
        onChange={() => setHearAbout([...hearAbout, "others"])}
      />
      <label htmlFor="othersHear">Others</label>

      <label htmlFor="city">City:</label>
      <select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
        <option value="Mumbai">Mumbai</option>
        <option value="Pune">Pune</option>
        <option value="Ahmedabad">Ahmedabad</option>
      </select>

      <label htmlFor="state">State:</label>
      <input
        type="text"
        id="state"
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder="State"
      />

      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Signing up..." : "Save"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SignupScreen;
