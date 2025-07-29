import Stripe from "stripe";
import { createOrder } from "../../lib/firestoreFetch";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // 1. Nhận dữ liệu từ client trước
      const items = req.body; // <-- Định nghĩa items trước khi sử dụng
      const origin = req.headers.origin || process.env.NEXT_PUBLIC_BASE_URL;

      // 2. Tạo session Stripe
      const params = {
        submit_type: "pay",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [{ shipping_rate: "shr_1Rlom9LqK3LZNTsfQHErWodR" }],
        line_items: items.map((item) => { // <-- Giờ items đã được định nghĩa
          const productImage = item.product.images?.[0] || '';
          
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.product.name,
                images: productImage ? [productImage] : [],
              },
              unit_amount: item.product.price * 100, 
            },
            quantity: item.quantity,
          };
        }),
        mode: "payment",
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart`,
      };

      const session = await stripe.checkout.sessions.create(params);

      // 3. CHỈ lưu order khi session được tạo thành công
      const orderData = {
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await createOrder(orderData); // <-- Hàm này bạn đã định nghĩa trong firestoreFetch.ts

      res.status(200).json(session);
    } catch (err) {
      console.error("Stripe API error:", err);
      res.status(500).json({ error: err.message });
    }
  }
}