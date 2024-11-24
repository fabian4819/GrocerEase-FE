import React from "react";
import "./Login.css";
import LoginButton from '../components/loginButton'

const Login = () => {
  console.log("Login component loaded");
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Masuk ke Dashboard</h2>
        <form>
          <div className="input-box">
            <label>Email</label>
            <input type="email" placeholder="email@mail.com" required />
          </div>
          <div className="input-box">
            <label>Password</label>
            <input type="password" placeholder="password" required />
          </div>
          <button type="submit" className="submit-btn">
            Masuk <span>➡️</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
