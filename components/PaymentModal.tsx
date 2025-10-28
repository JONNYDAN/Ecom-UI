import React, { useState } from "react";
import Modal from "react-modal";
import { FaCcStripe, FaTimes, FaSpinner } from "react-icons/fa";
import getStripe from "../lib/getStripe";
import { auth } from '../lib/firebase';

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

type PaymentMethod = 'stripe' | 'vnpay';

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
        await handleVNPayPayment();
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

      // 1. Lấy token từ Firebase Auth
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      
      const token = await user.getIdToken();

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
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
         },
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

  const handleVNPayPayment = async () => {
    setLoading('vnpay');
    setError(null);

    try {
      // Tính tổng số tiền cần thanh toán
      const totalAmount = cartItems 
        ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        : product!.price * qty!;

      // Lấy thông tin user từ Firebase Auth
      const user = auth.currentUser;
      if (!user) throw new Error("Vui lòng đăng nhập để thanh toán");
      
      const userEmail = user.email;
      const userName = user.displayName || "Khách hàng";

      // Gọi API VNPay
      const response = await fetch("/api/vnpay", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: {
            _id: cartItems ? 'multi-products' : product!._id,
            name: cartItems 
              ? `Đơn hàng ${cartItems.length} sản phẩm` 
              : product!.name,
            price: totalAmount,
            images: cartItems && cartItems.length > 0 
              ? cartItems[0].images 
              : product!.images
          },
          qty: 1,
          email: userEmail,
          phone: "" // Có thể thêm field nhập số điện thoại
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Khởi tạo thanh toán VNPay thất bại");
      }

      if (!data.success || !data.url) {
        throw new Error("Không nhận được URL thanh toán từ VNPay");
      }

      console.log("VNPay payment URL generated:", data.url);
      
      // Chuyển hướng đến trang thanh toán VNPay
      window.location.href = data.url;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi khi xử lý thanh toán VNPay";
      setError(errorMessage);
      console.error("VNPay payment error:", err);
    } finally {
      setLoading(null);
    }
  };

  const VNPayLogo = () => (
    <img 
      src="/images/vnpay-logo.jpg" 
      alt="VNPay Logo" 
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
            onClick={() => handlePayment('vnpay')}
            disabled={!!loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              background: loading === 'vnpay' ? "#3a7bb8" : "#005baa",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              opacity: loading && loading !== 'vnpay' ? 0.7 : 1,
              height: "48px"
            }}
          >
            {renderButtonContent('vnpay', <VNPayLogo />, "Thanh toán bằng VNPay")}
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