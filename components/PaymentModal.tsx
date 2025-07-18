import React from "react";
import Modal from "react-modal";
import { FaCcStripe, FaTimes } from "react-icons/fa";
import getStripe from "../lib/getStripe";

// Set app element for accessibility
Modal.setAppElement("#__next");

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  product: any;
  qty: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  product,
  qty,
}) => {
  const handleStripe = async () => {
    const stripe = await getStripe();
    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ ...product, quantity: qty }]),
    });
    if (response.status === 500) return;
    const data = await response.json();
    stripe.redirectToCheckout({ sessionId: data.id });
  };

  const handleOnePay = async () => {
    const response = await fetch("/api/onepay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, qty }),
    });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  // Simple OnePay logo using SVG
  const OnePayLogo = () => (
    // <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginRight: "12px" }}>
    //   <rect width="24" height="24" rx="4" fill="#005baa" />
    //   <text 
    //     x="12" 
    //     y="16" 
    //     fontFamily="Arial" 
    //     fontSize="12" 
    //     fontWeight="bold" 
    //     fill="white" 
    //     textAnchor="middle"
    //   >
    //     OP
    //   </text>
    // </svg>
    <img 
      src="/images/onepay.png" 
      alt="OnePay Logo" 
      style={{ marginRight: "12px", background: "white", padding: "1px", borderRadius: "15px" }}
        width="48"
    />
  );

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      contentLabel="Chọn phương thức thanh toán"
      className="payment-modal"
      overlayClassName="payment-modal-overlay"
    >
      <div style={{ position: "relative" }}>
        {/* Close button */}
        <button 
          onClick={onClose} 
          style={{
            position: "absolute",
            top: "-15px",
            right: "-15px",
            background: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            cursor: "pointer",
            color: "#666",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
          aria-label="Đóng"
        >
          <FaTimes />
        </button>
        
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "32px",
          color: "#333",
          fontSize: "24px",
          fontWeight: "600"
        }}>
          Chọn phương thức thanh toán
        </h2>
        
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          gap: "16px",
          width: "100%"
        }}>
          <button 
            className="payment-btn stripe" 
            onClick={handleStripe}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 24px",
              borderRadius: "8px",
              border: "none",
              background: "#635bff",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <FaCcStripe size={24} style={{ marginRight: "12px" }} />
            Thanh toán bằng Stripe
          </button>
          
          <button 
            className="payment-btn onepay" 
            onClick={handleOnePay}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 24px",
              borderRadius: "8px",
              border: "none",
              background: "#005baa",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <OnePayLogo />
            Thanh toán bằng OnePay
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;