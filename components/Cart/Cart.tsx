import { useRef, useState } from "react";
import Link from "next/link";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";

import { useStateContext } from "../../context/StateContext";
import { urlFor } from "../../lib/client";
import PaymentModal from "../PaymentModal";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import LoginRegisterModal from "../LoginRegisterModal/LoginRegisterModal";

type Props = {};

const Cart = (props: Props) => {
  const [user] = useAuthState(auth);
  const cartRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuantity,
    onRemove,
  } = useStateContext();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const firstProduct = cartItems[0];
  const firstQty = firstProduct?.quantity || 1;

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container px-2 py-4 w-screen sm:w-[600px]">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart items-center flex flex-col">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div key={item._id} className="product items-center">
                <div className="flex aspect-square w-[130px] h-[130px] sm:w-[200px] sm:h-[200px] justify-center ">
                  <img
                    src={urlFor(item?.images[0]).toString()}
                    className="cart-product-image w-full h-full object-cover"
                  />
                </div>
                <div className="item-desc w-full">
                  <div className="flex top flex-col">
                    <h5 className="font-bold text-2xl">{item.name}</h5>
                    <h4 className="font-bold text-xl mt-2">${item.price}</h4>
                  </div>
                  <div className="flex bottom w-full">
                    <div>
                      <p className="quantity-desc flex-row flex m-0 ">
                        <span
                          className="minus px-2 self-center sm:px-4 sm:py-3 md:px-3 md:py-2"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "dec")
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span
                          className="num px-4 py-1 self-center font-normal text-[14px] xs:text-[16px] sm:text-[20px] sm:px-6 sm:py-3 md:text-[18px] md:px-4 md:py-2"
                          onClick={() => {}}
                        >
                          {item.quantity}
                        </span>
                        <span
                          className="plus px-2 self-center sm:px-4 sm:py-3 md:px-3 md:py-2"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "inc")
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => onRemove(item)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${totalPrice}</h3>
            </div>

            <div className="btn-container">
            {!user ? (
              <button
              type="button"
              className="btn"
              onClick={() => setIsModalOpen(true)}
              >
                Purchase
              </button>
            ):(
              <button
                type="button"
                className="btn"
                onClick={() => setShowPaymentModal(true)}
              >
                Purchase
              </button>
            )}
            </div>
          </div>
        )}
        <PaymentModal
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          cartItems={cartItems}      // All cart items
          totalPrice={totalPrice}    // Calculated total
          totalQuantities={totalQuantities}
        />
        <LoginRegisterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLoginSuccess={() => {
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default Cart;
