import React, { useContext } from "react";
import { AccountContext } from "./accountContext";
import { Marginer } from "./marginer";

export function LoginForm() {
  const { switchToRegister } = useContext(AccountContext);
  return (
    <div className="login-modal-box-container">
      <form className="login-modal-form-container">
        <input className="login-modal-input" type="email" placeholder="Email" />
        <input className="login-modal-input" type="password" placeholder="Password" />
      </form>
      <Marginer direction="vertical" margin={10} />
      <a className="login-modal-muted-link" href="#">
        Forget your password?
      </a>
      <Marginer direction="vertical" margin="1.6em" />
      <button className="login-modal-submit-button" type="submit">
        Sign in
      </button>
      <Marginer direction="vertical" margin="5px" />
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
