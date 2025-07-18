import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import { Cart } from "../";
import { useStateContext } from "../../context/StateContext";

import { useState } from "react";
import "flowbite";

type Props = {};

const Navbar = (props: Props) => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  const [openModal, setOpenModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="navbar-container items-center">
      <p className="logo">
        <Link href="/">E-commerce</Link>
      </p>

      <div className="flex justify-end items-center h-full gap-4">
        <button
          type="button"
          className="cart-icon flex"
          onClick={() => setShowCart(true)}
        >
          <AiOutlineShopping />
          <span className="cart-item-qty">{totalQuantities}</span>
        </button>

        <button
          onClick={() => setOpenModal(true)}
          className=" relative flex w-6 h-6 overflow-hidden bg-gray-100 rounded-full border-0 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm text-center"
          type="button"
        >
          <svg
            className="absolute w-8 h-8 text-gray-400 -left-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      {openModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          aria-hidden="false"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 ">
                <h3 className="text-xl font-semibold text-gray-900 ">
                  {isLogin ? "Đăng nhập" : "Đăng ký"}
                </h3>
                <button
                  onClick={() => setOpenModal(false)}
                  className="text-gray-400 bg-white hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 inline-flex justify-center items-center border-0"
                >
                  <span className="sr-only">Đóng</span>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 14 14"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal body */}
              <div className="p-4 md:p-5">
                <form className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      required
                    />
                  </div>
                  {!isLogin && (
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Xác nhận mật khẩu
                      </label>
                      <input
                        type="text"
                        id="confirmPassword"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        required
                      />
                    </div>
                  )}
                  {isLogin && (
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
                        />
                        <label
                          htmlFor="remember"
                          className="ml-2 text-sm text-gray-900 "
                        >
                          Ghi nhớ tôi
                        </label>
                      </div>
                      <a
                        href="#"
                        className="text-sm text-blue-700 hover:underline "
                      >
                        Quên mật khẩu?
                      </a>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="login-modal-btn w-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border-0"
                  >
                    {isLogin ? "Đăng nhập" : "Đăng ký"}
                  </button>
                  <div className="text-sm font-medium text-gray-500 ">
                    {isLogin ? (
                      <>
                        Chưa có tài khoản?{" "}
                        <button
                          type="button"
                          className="text-blue-700 hover:underline border-0 bg-white"
                          onClick={() => setIsLogin(false)}
                        >
                          Đăng ký
                        </button>
                      </>
                    ) : (
                      <>
                        Đã có tài khoản?{" "}
                        <button
                          type="button"
                          className="text-blue-700 hover:underline border-0 bg-white"
                          onClick={() => setIsLogin(true)}
                        >
                          Đăng nhập
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
