import { useState, useEffect } from "react";
import { LoginForm } from "./loginForm";
import { RegisterForm } from "./registerForm";
import { motion } from "framer-motion";
import { AccountContext } from "./accountContext";


type LoginRegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
};

const backdropVariants = {
  expanded: {
    width: "233%",
    height: "1050px",
    borderRadius: "20%",
    transform: "rotate(60deg)",
  },
  collapsed: {
    width: "160%",
    height: "550px",
    borderRadius: "50%",
    transform: "rotate(60deg)",
  },
};

const expandingTransition = {
  type: "spring",
  duration: 2.3,
  stiffness: 30,
};

export default function LoginRegisterModal({
  isOpen,
  onClose,
  onLoginSuccess
}: LoginRegisterModalProps) {
  const [isExpanded, setExpanded] = useState(false);
  const [active, setActive] = useState<"login" | "register">("login");

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  const playExpandingAnimation = () => {
    setExpanded(true);
    setTimeout(() => {
      setExpanded(false);
    }, expandingTransition.duration * 1000 - 1500);
  };

  const switchToRegister = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("register");
    }, 400);
  };

  const switchToLogin = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("login");
    }, 400);
  };

  const contextValue = { switchToRegister, switchToLogin };

  if (!isOpen) return null;

  return (
    <AccountContext.Provider value={contextValue}>
      <div className="login-modal-overlay">
        <div className="modal-box-container">
          <button className="login-modal-close-button" onClick={onClose}>
            &times;
          </button>
          <div className="login-modal-top-container">
            <motion.div
              className="login-modal-back-drop"
              initial={false}
              animate={isExpanded ? "expanded" : "collapsed"}
              variants={backdropVariants}
              transition={expandingTransition}
            />
            {active === "login" && (
              <div className="login-modal-header-container">
                <div className="login-modal-header-text">Welcome</div>
                <div className="login-modal-header-text">Back</div>
                <div className="login-modal-small-text">
                  Please login to continue!
                </div>
              </div>
            )}
            {active === "register" && (
              <div className="login-modal-header-container">
                <div className="login-modal-header-text">Create</div>
                <div className="login-modal-header-text">Account</div>
                <div className="login-modal-small-text">
                  Please sign up to continue!
                </div>
              </div>
            )}
          </div>
          <div className="login-modal-inner-container">
            {active === "login" && <LoginForm onLoginSuccess={onLoginSuccess} />}
            {active === "register" && <RegisterForm />}
          </div>
        </div>
      </div>
    </AccountContext.Provider>
  );
}
