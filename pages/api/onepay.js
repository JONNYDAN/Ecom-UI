// import crypto from "crypto";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     res.status(405).end("Method Not Allowed");
//     return;
//   }

//   const { product, qty } = req.body;

//   // Thông tin cấu hình OnePay
//   const onepay_Merchant = process.env.ONEPAY_MERCHANT_ID;
//   const onepay_AccessCode = process.env.ONEPAY_ACCESS_CODE;
//   const onepay_Secret = process.env.ONEPAY_SECRET;
//   const onepay_Url = "https://mtf.onepay.vn/vpcpay/vpcpay.op";
//   const onepay_ReturnUrl = `${req.headers.origin}/?onepayReturn=true`;

//   // Tạo dữ liệu thanh toán
//   const params = {
//     vpc_Version: "2",
//     vpc_Command: "pay",
//     vpc_Merchant: onepay_Merchant,
//     vpc_AccessCode: onepay_AccessCode,
//     vpc_MerchTxnRef: Date.now().toString(),
//     vpc_OrderInfo: `Thanh toán sản phẩm ${product.name}`,
//     vpc_Amount: product.price * qty * 100, // OnePay yêu cầu số tiền * 100
//     vpc_Currency: "VND",
//     vpc_Locale: "vn",
//     vpc_ReturnURL: onepay_ReturnUrl,
//     vpc_TicketNo: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
//     vpc_Title: "Ecommerce Payment",
//   };

//   // Sắp xếp tham số theo thứ tự alphabet
//   const sortedParams = Object.keys(params)
//     .sort()
//     .reduce((r, k) => ((r[k] = params[k]), r), {});

//   // Tạo chuỗi hash
//   const signData = Object.entries(sortedParams)
//     .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
//     .join("&");

//   // Tạo secure hash
//   const secureHash = crypto
//     .createHmac("sha256", onepay_Secret)
//     .update(signData)
//     .digest("hex")
//     .toUpperCase();

//   // Tạo URL thanh toán
//   const paymentUrl =
//     `${onepay_Url}?${signData}&vpc_SecureHash=${secureHash}`;

//   res.status(200).json({ url: paymentUrl });
// }

import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  const { product, qty } = req.body; // Receive product and qty from frontend

  // OnePay configuration details
  const onepay_Merchant = process.env.ONEPAY_MERCHANT_ID;  // Merchant ID from OnePay
  const onepay_AccessCode = process.env.ONEPAY_ACCESS_CODE;  // Access Code from OnePay
  const onepay_Secret = process.env.ONEPAY_SECRET;  // Secret Key from OnePay
  const onepay_Url = "https://mtf.onepay.vn/vpcpay/vpcpay.op";  // OnePay payment URL
  const onepay_ReturnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/onepay-return`;  // hoặc route bạn xử lý kết quả


  // Create the payment parameters
  const params = {
    vpc_Version: "2",
    vpc_Command: "pay",
    vpc_Merchant: onepay_Merchant,
    vpc_AccessCode: onepay_AccessCode,
    vpc_MerchTxnRef: Date.now().toString(),  // Unique transaction reference
    vpc_OrderInfo: `Thanh toan san pham ${product.name}`,  // Product name as order info
    vpc_Amount: product.price * qty * 100,  // Amount in VND (multiply by 100)
    vpc_Currency: "VND",
    vpc_TicketNo: '127.0.0.1',
    vpc_Locale: "vn",  // Locale for Vietnam
    vpc_ReturnURL: onepay_ReturnUrl,  // Return URL
    // vpc_TicketNo: req.headers["x-forwarded-for"] || req.socket.remoteAddress,  // Customer's IP address
    vpc_Title: "Ecommerce Payment",  // Title of the payment
    vpc_SecureHashType: "SHA256",
  };

  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((r, k) => ((r[k] = params[k]), r), {});

  // Create the string to sign (for secure hash generation)
  const signData = Object.entries(sortedParams)
    .map(([k, v]) => `${k}=${v}`) // ✅ KHÔNG encod
    .join("&");

  // Generate secure hash using SHA-256
  const secureHash = crypto
    .createHmac("sha256", onepay_Secret) 
    .update(signData) 
    .digest("hex")  // Generate the hash
    .toUpperCase();  // Convert the hash to uppercase as per OnePay's requirement

  // Generate the final payment URL
  const paymentUrl = `${onepay_Url}?${signData}&vpc_SecureHash=${secureHash}`;
  console.log("signData:", signData);
  console.log("paymentUrl:", paymentUrl);

  // Respond with the payment URL to the frontend
  res.status(200).json({ url: paymentUrl });
}
