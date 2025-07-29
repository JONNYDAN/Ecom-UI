import Stripe from 'stripe';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Xử lý khi thanh toán thành công
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Cập nhật order trong Firestore
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('stripeSessionId', '==', session.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'orders', orderDoc.id), {
          status: 'completed',
          paymentStatus: 'paid',
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Lấy thông tin khách hàng từ metadata
    const userId = session.metadata.userId;
    
    // Cập nhật đơn hàng trong Firestore
    await updateOrderStatus(session.id, userId, 'completed');
  }

    async function updateOrderStatus(sessionId, userId, status) {
        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef, 
            where('stripeSessionId', '==', sessionId),
            where('userId', '==', userId)
    );
  
  const snapshot = await getDocs(q);
  snapshot.forEach(async (doc) => {
    await updateDoc(doc.ref, { 
      status: status,
      paymentStatus: 'paid',
      updatedAt: new Date().toISOString()
    });
  });
}

  res.status(200).json({ received: true });
}