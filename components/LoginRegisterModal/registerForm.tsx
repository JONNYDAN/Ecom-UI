import React, { useContext } from "react";
import { AccountContext } from "./accountContext";

export function RegisterForm() {
  const { switchToLogin } = useContext(AccountContext);
  return (
    <div className="login-modal-box-container">
      <form className="login-modal-form-container">
        <input className="login-modal-input" type="text" placeholder="Full name" />
        <input className="login-modal-input" type="email" placeholder="Email" />
        <input className="login-modal-input" type="password" placeholder="Password" />
        <input className="login-modal-input" type="password" placeholder="Confirm Password" />
      </form>
      <span style={{ display: "flex", height: "10px" }} />
      <button className="login-modal-submit-button" type="submit">
        Sign up
      </button>
      <span style={{ display: "flex", height: "10px" }} />
      <p className="login-modal-line-text">
        {" "}
        Already have an account?{" "}
        <a onClick={switchToLogin} className="login-modal-bold-link" href="#">
          Sign in
        </a>
      </p>
    </div>
  );
}
