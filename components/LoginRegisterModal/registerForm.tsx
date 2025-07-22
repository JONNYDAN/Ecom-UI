import React, { useContext, useState } from "react";
import { AccountContext } from "./accountContext";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { saveUserToFirestore } from "../../lib/user";

export function RegisterForm() {
  const { switchToLogin } = useContext(AccountContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await saveUserToFirestore(user.uid, email, fullName);
      switchToLogin?.();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-modal-box-container">
      <form className="login-modal-form-container" onSubmit={handleSubmit}>
        <input
          className="login-modal-input"
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          className="login-modal-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-modal-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input className="login-modal-input" type="password" placeholder="Confirm Password" />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button className="login-modal-submit-button" type="submit">
          Sign up
        </button>
      </form>
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
