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
    width: "400%",
    height: "1500px",
    borderRadius: "20%",
    transform: "rotate(60deg)",
  },
  collapsed: {
    width: "180%",
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
        <div className="modal-box-container w-full h-full rounded-none xs:w-[300px] xs:h-[550px] xs:rounded-2xl lg:w-[350px]">
          <button className="login-modal-close-button" onClick={onClose}>
            &times;
          </button>
          <div className="login-modal-top-container px-[30px] pt-0 pb-[4em] xs:px-[2.5em]">
            <motion.div
              className="login-modal-back-drop top-[-370px] left-[-185px] xs:top-[-350px] xs:left-[-150px] lg:top-[-380px] lg:left-[-190px]"
              initial={false}
              animate={isExpanded ? "expanded" : "collapsed"}
              variants={backdropVariants}
              transition={expandingTransition}
            />
            {active === "login" && (
              <div className="login-modal-header-container">
                <div className="login-modal-header-text text-[23px] xs:text-[25px]">Welcome</div>
                <div className="login-modal-header-text text-[23px] xs:text-[25px]">Back</div>
                <div className="login-modal-small-text text-[11px] xs:text-[12px]">
                  Please login to continue!
                </div>
              </div>
            )}
            {active === "register" && (
              <div className="login-modal-header-container">
                <div className="login-modal-header-text text-[23px] xs:text-[25px]">Create</div>
                <div className="login-modal-header-text text-[23px] xs:text-[25px]">Account</div>
                <div className="login-modal-small-text text-[11px] xs:text-[12px]">
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
