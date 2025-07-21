import React, { useContext } from "react";
import { AccountContext } from "./accountContext";

export function LoginForm() {
  const { switchToRegister } = useContext(AccountContext);
  return (
    <div className="login-modal-box-container">
      <form className="login-modal-form-container">
        <input className="login-modal-input" type="email" placeholder="Email" />
        <input className="login-modal-input" type="password" placeholder="Password" />
      </form>
      <span style={{ display: "flex", height: "10px" }} />
      <a className="login-modal-muted-link" href="#">
        Forget your password?
      </a>
      <span style={{ display: "flex", height: "1.6em" }} />
      <button className="login-modal-submit-button" type="submit">
        Sign in
      </button>
      <span style={{ display: "flex", height: "10px" }} />
      <p className="login-modal-line-text">
        {" "}
        Don't have an account?{" "}
        <a onClick={switchToRegister} className="login-modal-bold-link" href="#">
          Sign up
        </a>
      </p>
    </div>
  );
}
