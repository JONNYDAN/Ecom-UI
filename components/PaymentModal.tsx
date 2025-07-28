import React, { useState } from "react";
import Modal from "react-modal";
import { FaCcStripe, FaTimes, FaSpinner } from "react-icons/fa";
import getStripe from "../lib/getStripe";

// Set app element for accessibility
Modal.setAppElement("#__next");

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity?: number;
  images?: string[]; 
}
interface ProductItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
  description?: string;
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  product?: ProductItem; // For single product purchase
  qty?: number;         // For single product purchase
  cartItems?: ProductItem[]; // For cart purchase
  totalPrice?: number;  // For cart purchase
  totalQuantities?: number; // Add this new prop
}

type PaymentMethod = 'stripe' | 'onepay';

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  product,
  qty = 1,
  cartItems,
  totalPrice,
}) => {
  const [loading, setLoading] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState<string | null>(null);

  //  const validateCart = (): boolean => {
  //   if (!cartItems || cartItems.length === 0) {
  //     setError("Giỏ hàng trống");
  //     return false;
  //   }
  //   if (cartItems.some(item => item.quantity <= 0)) {
  //     setError("Số lượng sản phẩm không hợp lệ");
  //     return false;
  //   }
  //   return true;
  // };

  const handlePayment = async (method: PaymentMethod) => {
    // if (!validateCart()) return;

    setLoading(method);
    setError(null);
    
    try {
      if (method === 'stripe') {
        await handleStripePayment();
      } else {
        await handleOnePayPayment();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không mong muốn");
      console.error(`${method} payment error:`, err);
    } finally {
      setLoading(null);
    }
  };

  // const validateItems = (): boolean => {
  //   // For cart purchase
  //   if (cartItems) {
  //     if (cartItems.length === 0) {
  //       setError("Giỏ hàng trống");
  //       return false;
  //     }
  //     if (cartItems.some(item => item.quantity <= 0)) {
  //       setError("Số lượng sản phẩm không hợp lệ");
  //       return false;
  //     }
  //     return true;
  //   }
  //   // For single product purchase
  //   else if (product) {
  //     if (qty <= 0) {
  //       setError("Số lượng sản phẩm không hợp lệ");
  //       return false;
  //     }
  //     return true;
  //   }
    
  //   setError("Không có sản phẩm nào để thanh toán");
  //   return false;
  // };

  const handleStripePayment = async () => {
    // if (!validateItems()) return;

    setLoading('stripe');
    setError(null);
    
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Không thể kết nối với Stripe");
      }

      // Prepare items based on purchase type
      const items = cartItems 
        ? cartItems.map(item => ({
            product: {
              _id: item._id,
              name: item.name,
              price: item.price,
              images: item.images
            },
            quantity: item.quantity
          }))
        : [{
            product: {
              _id: product!._id,
              name: product!.name,
              price: product!.price,
              images: product!.images
            },
            quantity: qty!
          }];

      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Thanh toán Stripe thất bại");
      }

      const data = await response.json();
      if (!data?.id) {
        throw new Error("Không nhận được session ID từ Stripe");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ 
        sessionId: data.id 
      });

      if (stripeError) {
        throw new Error(stripeError.message || "Lỗi chuyển hướng đến Stripe");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không mong muốn");
      console.error("Stripe payment error:", err);
    } finally {
      setLoading(null);
    }
  };

  const handleOnePayPayment = async () => {
    // if (!validateItems()) return;

    setLoading('onepay');
    setError(null);

    try {
      // Tính tổng số tiền cần thanh toán
      const totalAmount = cartItems 
        ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        : product!.price * qty!;

      // Lấy thông tin khách hàng (nên lấy từ form thực tế)
      const customerInfo = {
        email: "customer@example.com", // Thay bằng email thực
        name: "Customer Name",        // Thay bằng tên thực
        phone: "0123456789"          // Thay bằng số điện thoại thực
      };

      // Gọi API OnePay với tổng số tiền
      const response = await fetch("/api/onepay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            // Tạo product tổng hợp cho đơn hàng
            _id: cartItems ? 'multi-products' : product!._id,
            name: cartItems 
              ? `Đơn hàng ${cartItems.length} sản phẩm` 
              : product!.name,
            price: totalAmount, // Truyền tổng số tiền
            images: cartItems && cartItems.length > 0 
              ? cartItems[0].images 
              : product!.images
          },
          qty: 1, // Luôn là 1 vì đã tính tổng
          email: customerInfo.email,
          phone: customerInfo.phone
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Khởi tạo thanh toán OnePay thất bại");
      }

      const data = await response.json();
      if (!data?.url) {
        throw new Error("Không nhận được URL thanh toán từ OnePay");
      }

      // Chuyển hướng đến trang thanh toán OnePay
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi xử lý thanh toán OnePay");
      console.error("OnePay payment error:", err);
    } finally {
      setLoading(null);
    }
  };

  const OnePayLogo = () => (
    <img 
      src="/images/onepay.png" 
      alt="OnePay Logo" 
      style={{ 
        marginRight: "12px", 
        background: "white", 
        padding: "4px", 
        borderRadius: "4px",
        width: "24px",
        height: "24px",
        objectFit: "contain"
      }}
    />
  );

  const renderButtonContent = (method: PaymentMethod, icon: React.ReactNode, text: string) => (
    <>
      {loading === method ? (
        <FaSpinner className="animate-spin" />
      ) : (
        <>
          {icon}
          {text}
        </>
      )}
    </>
  );

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      contentLabel="Chọn phương thức thanh toán"
      className="payment-modal"
      overlayClassName="payment-modal-overlay"
      style={{
        content: {
          maxWidth: "400px",
          margin: "auto",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        },
        overlay: {
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      }}
    >
      <div style={{ position: "relative" }}>
        {/* Close button */}
        <button 
          onClick={onClose} 
          style={{
            position: "absolute",
            top: "-12px",
            right: "-12px",
            background: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            cursor: "pointer",
            color: "#666",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 1
          }}
          aria-label="Đóng"
          disabled={!!loading}
        >
          <FaTimes />
        </button>
        
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "24px",
          color: "#333",
          fontSize: "20px",
          fontWeight: "600"
        }}>
          Chọn phương thức thanh toán
        </h2>
        
        {error && (
          <div style={{
            padding: "12px",
            marginBottom: "16px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "8px",
            fontSize: "14px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}
        
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          gap: "12px",
          width: "100%"
        }}>
          <button 
            onClick={() => handlePayment('stripe')}
            disabled={!!loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              background: loading === 'stripe' ? "#7c74ff" : "#635bff",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              opacity: loading && loading !== 'stripe' ? 0.7 : 1,
              height: "48px"
            }}
          >
            {renderButtonContent('stripe', <FaCcStripe size={20} />, "Thanh toán bằng Stripe")}
          </button>
          
          <button 
            onClick={() => handlePayment('onepay')}
            disabled={!!loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              background: loading === 'onepay' ? "#3a7bb8" : "#005baa",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              opacity: loading && loading !== 'onepay' ? 0.7 : 1,
              height: "48px"
            }}
          >
            {renderButtonContent('onepay', <OnePayLogo />, "Thanh toán bằng OnePay")}
          </button>
        </div>

        <div style={{
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: "1px solid #eee",
          textAlign: "center",
          fontSize: "12px",
          color: "#666"
        }}>
          Thanh toán an toàn và bảo mật
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;