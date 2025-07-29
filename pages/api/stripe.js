import Stripe from "stripe";
import { createOrder } from "../../lib/firestoreFetch";
import admin from "../../lib/firebaseAdmin";
import { getAuthUser } from '../../lib/authUtils'; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16"
});

export default async function handler(req, res) {
  // Xử lý CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    return res.status(200).end();
  }

  
  if (req.method === "POST") {
    try {
      // 1. Xác thực người dùng
      const user = await getAuthUser(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // 2. Validate request body
      if (!req.body || !Array.isArray(req.body)) {
        return res.status(400).json({ error: "Invalid request format" });
      }

      const items = req.body;
      const customerData = req.body.customer || {};
      const origin = req.headers.origin || process.env.NEXT_PUBLIC_BASE_URL;

      // 3. Tạo session Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: user.email,
        metadata: { userId: user.uid },
        line_items: items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.product.name,
              images: item.product.images?.filter(Boolean).slice(0, 1) || [],
            },
            unit_amount: Math.round(item.product.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/`,
        shipping_options: [{ shipping_rate: "shr_1Rlom9LqK3LZNTsfQHErWodR" }],
      });

      // 4. Lưu order
      const orderData = {
        id: session.id,
        customer_details: {
          name: user.name || customerData.name || "Customer",
          email: user.email || customerData.email,
        },
        userId: user.uid,
        stripeSessionId: session.id,
        items: items.map(item => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images?.[0] || null
        })),
        totalAmount: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        status: "pending",
        paymentStatus: "unpaid",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await createOrder(orderData);

      return res.status(200).json({ id: session.id });
    } catch (err) {
      console.error("API Error:", err);
      return res.status(err.statusCode || 500).json({ 
        error: err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
      });
    }
  }
  res.setHeader("Allow", "POST");
  return res.status(405).end("Method Not Allowed");
}
