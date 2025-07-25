import React, { useContext, useState } from "react";
import { AccountContext } from "./accountContext";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { saveUserToFirestore } from "../../lib/user";

type LoginFormProps = {
  onLoginSuccess?: () => void;
};

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { switchToRegister } = useContext(AccountContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess?.();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Lưu thông tin user nếu là lần đầu đăng nhập
      await saveUserToFirestore(
        user.uid,
        user.email || "",
        user.displayName || user.email?.split("@")[0] || "user"
      );
      onLoginSuccess?.();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-modal-box-container">
      <form className="login-modal-form-container" onSubmit={handleSubmit}>
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
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button className="login-modal-submit-button" type="submit">
          Sign in
        </button>
      </form>
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 mt-4 w-full py-2 px-4 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <g>
            <path fill="#4285F4" d="M21.6 12.227c0-.818-.073-1.604-.209-2.364H12v4.482h5.352a4.579 4.579 0 01-1.98 3.008v2.497h3.2c1.872-1.724 2.928-4.267 2.928-7.623z"/>
            <path fill="#34A853" d="M12 22c2.43 0 4.47-.805 5.96-2.188l-3.2-2.497c-.89.6-2.027.955-3.26.955-2.507 0-4.63-1.694-5.388-3.97H2.89v2.49A9.997 9.997 0 0012 22z"/>
            <path fill="#FBBC05" d="M6.612 14.3a5.996 5.996 0 010-3.8V8.01H2.89a9.997 9.997 0 000 7.98l3.722-1.69z"/>
            <path fill="#EA4335" d="M12 6.58c1.32 0 2.5.454 3.43 1.345l2.57-2.57C16.47 3.805 14.43 3 12 3A9.997 9.997 0 002.89 8.01l3.722 2.49C7.37 8.274 9.493 6.58 12 6.58z"/>
          </g>
        </svg>
      </button>
      <span style={{ display: "flex", height: "10px" }} />
      <a className="login-modal-muted-link" href="#">
        Forget your password?
      </a>
      <span style={{ display: "flex", height: "1.6em" }} />
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
