import React, { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password);
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
      <input
        type="password"
        name="signupPassword"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button className="glow-button" disabled={isLoading}>Sign up</button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default Signup;
