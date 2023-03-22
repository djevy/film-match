import React, { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, isLoading } = useLogin();

  const handleShowPasswordClick = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log in</h3>
      <label htmlFor="loginEmail">Email:</label>
      <input
        type="email"
        name="loginEmail"
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
      <button className="glow-button" disabled={isLoading}>
        Log in
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Login;
