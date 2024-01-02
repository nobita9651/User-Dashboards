// SignupLogin.js
import React, { useState } from "react";
import LoginForm from "./loginform";
import SignupForm from "./signupForm";
import { useHistory } from "react-router-dom";
import "./login.css"; // Import the CSS file

const SignupLogin = ({ setIsOnline, fetchData, setLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const history = useHistory();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSuccessfulLogin = (token) => {
    console.log("Login successful. Token:", token);
    setIsOnline(true);
    setLoggedIn(true);
    localStorage.setItem("authToken", token);

    console.log("History object:", history); // Add this line
    history.push("/dashboard");
  };

  const handleSuccessfulSignup = (token) => {
    setIsOnline(true);
    setLoggedIn(true);
    // Store the authentication token in local storage
    localStorage.setItem("authToken", token);
  };

  return (
    <div>
      <div className="switch-button-container">
        <button className="switch-button" onClick={toggleForm}>
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </div>
      {isLogin ? (
        <LoginForm
          setIsOnline={setIsOnline}
          fetchData={fetchData}
          onSuccessfulLogin={(token) => handleSuccessfulLogin(token, history)}
        />
      ) : (
        <SignupForm
          fetchData={fetchData}
          onSuccessfulSignup={handleSuccessfulSignup}
        />
      )}
    </div>
  );
};

export default SignupLogin;
