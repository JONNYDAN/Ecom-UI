import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  const { product, qty } = req.body;

  // Thông tin cấu hình OnePay
  const onepay_Merchant = process.env.ONEPAY_MERCHANT_ID;
  const onepay_AccessCode = process.env.ONEPAY_ACCESS_CODE;
  const onepay_Secret = process.env.ONEPAY_SECRET;
  const onepay_Url = "https://mtf.onepay.vn/vpcpay/vpcpay.op";
  const onepay_ReturnUrl = `${req.headers.origin}/?onepayReturn=true`;

  // Tạo dữ liệu thanh toán
  const params = {
    vpc_Version: "2",
    vpc_Command: "pay",
    vpc_Merchant: onepay_Merchant,
    vpc_AccessCode: onepay_AccessCode,
    vpc_MerchTxnRef: Date.now().toString(),
    vpc_OrderInfo: `Thanh toán sản phẩm ${product.name}`,
    vpc_Amount: product.price * qty * 100, // OnePay yêu cầu số tiền * 100
    vpc_Currency: "VND",
    vpc_Locale: "vn",
    vpc_ReturnURL: onepay_ReturnUrl,
    vpc_TicketNo: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    vpc_Title: "Ecommerce Payment",
  };

  // Sắp xếp tham số theo thứ tự alphabet
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((r, k) => ((r[k] = params[k]), r), {});

  // Tạo chuỗi hash
  const signData = Object.entries(sortedParams)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  // Tạo secure hash
  const secureHash = crypto
    .createHmac("sha256", onepay_Secret)
    .update(signData)
    .digest("hex")
    .toUpperCase();

  // Tạo URL thanh toán
  const paymentUrl =
    `${onepay_Url}?${signData}&vpc_SecureHash=${secureHash}`;

  res.status(200).json({ url: paymentUrl });
}