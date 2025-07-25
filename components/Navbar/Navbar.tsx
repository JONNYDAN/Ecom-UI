import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import { FaRegUser, FaSignOutAlt } from "react-icons/fa";
import { Cart } from "../";
import { useStateContext } from "../../context/StateContext";
import { useState, useEffect } from "react";
import LoginRegisterModal from "../LoginRegisterModal/LoginRegisterModal";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import AvatarDropdown from "../Dropdown";

type Props = {};

const Navbar = (props: Props) => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Lấy thông tin người dùng từ Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          console.log("User Firestore data:", userDoc.data());
          setUserData(userDoc.data());
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  return (
    <div className="navbar-container m-4">
      <p className="logo whitespace-nowrap">
        <Link href="/">E-commerce</Link>
      </p>

      <div className="navbar-icons">
        <button
          type="button"
          className="cart-icon"
          onClick={() => setShowCart(true)}
        >
          <AiOutlineShopping />
          <span className="cart-item-qty">{totalQuantities}</span>
        </button>
        {!user ? (
          <button
            type="button"
            className="user-icon"
            onClick={() => setIsModalOpen(true)}
          >
            <FaRegUser />
          </button>
        ) : (
          <div className="navbar-profile">
            <div className="navbar-profile flex items-center gap-3">
              <AvatarDropdown
                avatarUrl={userData?.avatar || "/default-avatar.png"}
                onLogout={handleLogout}
              />
            </div>
          </div>
        )}
      </div>

      <LoginRegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={() => {
          setIsModalOpen(false);
        }}
      />

      {showCart && <Cart />}

      <style jsx>{`
        .logo a {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          text-decoration: none;
        }

        .navbar-icons {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .cart-icon,
        .user-icon {
          position: relative;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cart-icon:hover,
        .user-icon:hover {
          color: #0070f3;
          transform: translateY(-2px);
        }

        .cart-item-qty {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #0070f3;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.75rem;
        }

        .navbar-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #ddd;
        }

        .user-email {
          font-size: 0.9rem;
          color: #555;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: 1px solid #ddd;
          border-radius: 50%;
          padding: 0.5rem;
          color: #555;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: #f5f5f5;
          border-color: #bbb;
          color: #333;
        }

        .logout-icon {
          transition: transform 0.3s ease;
        }

        .logout-btn:hover .logout-icon {
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
};

export default Navbar;
