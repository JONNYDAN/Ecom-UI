const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const sanityClient = require('@sanity/client');

const firebaseConfig = {
  apiKey: "AIzaSyCaZx_SMB46BDISq7J_g2zT-puy2uKaRgA",
  authDomain: "tutor-hcmue.firebaseapp.com",
  databaseURL: "https://tutor-hcmue-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tutor-hcmue",
  storageBucket: "tutor-hcmue.firebasestorage.app",
  messagingSenderId: "617799958380",
  appId: "1:617799958380:web:f63f2e90ececf7537e7d49",
  measurementId: "G-QQJM942KD1"
};
initializeApp({
  credential: cert(require("../serviceAccountKey.json")),
  databaseURL: "https://tutor-hcmue-default-rtdb.asia-southeast1.firebasedatabase.app"
});
const db = getFirestore();

const client = sanityClient({
  projectId: 'hon77rsr',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-07-22',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN
});

async function migrateProducts() {
  const products = await client.fetch('*[_type == "product"]');
  for (const product of products) {
    // Lấy URL hình ảnh
    const imageUrl = product.image && product.image.asset
      ? `https://cdn.sanity.io/images/hon77rsr/production/${product.image.asset._ref.split('-').slice(1).join('-').replace('.webp', '')}.webp`
      : "";

    await db.collection('products').doc(product._id).set({
      ...product,
      image: imageUrl,
    });
  }
}

async function migrateBanners() {
  const banners = await client.fetch('*[_type == "banner"]');
  for (const banner of banners) {
    const imageUrl = banner.image && banner.image.asset
      ? `https://cdn.sanity.io/images/hon77rsr/production/${banner.image.asset._ref.split('-').slice(1).join('-').replace('.webp', '')}.webp`
      : "";

    await db.collection('banners').doc(banner._id).set({
      ...banner,
      image: imageUrl,
    });
  }
}

(async () => {
  await migrateProducts();
  await migrateBanners();
  console.log("Migration completed!");
})();