import React, { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, isLoading, error } = useSignup();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password, confirmPassword);
  };

  const handleShowPasswordClick = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign up</h3>
      <label htmlFor="signupEmail">Email:</label>
      <input
        type="email"
        name="signupEmail"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label htmlFor="signupPassword">Password:</label>
      <div className="password-input">
        <input
          type={showPassword ? "text" : "password"}
          name="signupPassword"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button
          className="show-password-button"
          onClick={handleShowPasswordClick}
        >
          {showPassword ? (
            <span className="material-symbols-outlined">visibility</span>
          ) : (
            <span className="material-symbols-outlined">visibility_off</span>
          )}
        </button>
      </div>
      <label htmlFor="confirmPassword">Confirm Password:</label>
<div className="password-input">
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
                <button
          className="show-password-button"
          onClick={handleShowPasswordClick}
        >
          {showPassword ? (
            <span className="material-symbols-outlined">visibility</span>
          ) : (
            <span className="material-symbols-outlined">visibility_off</span>
          )}
        </button>
</div>
      <button className="glow-button" disabled={isLoading}>
        Sign up
      </button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default Signup;
