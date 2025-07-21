import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { Cart } from "../";
import { useStateContext } from "../../context/StateContext";
import { useState } from "react";
import LoginRegisterModal from "../LoginRegisterModal/LoginRegisterModal";

type Props = {};

const Navbar = (props: Props) => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="navbar-container">
      <p className="logo">
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
        <button
          type="button"
          className="user-icon"
          onClick={() => setIsModalOpen(true)}
        >
          <FaRegUser />
        </button>
      </div>

      <LoginRegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
