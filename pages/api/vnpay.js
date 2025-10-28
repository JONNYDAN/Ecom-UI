import crypto from "crypto";
import querystring from "querystring";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  const { product, qty } = req.body;

  // VNPay configuration
  const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
  const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
  const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const vnp_ReturnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/vnpay-return`;

  // Get current USD to VND rate
  let USD_TO_VND = 25000; // Fallback rate
  try {
    const rateRes = await fetch(
      "http://api.exchangerate.host/live?access_key=ccfe080cae6f5b164469940a3e94d56f&source=USD&currencies=VND"
    );
    const rateData = await rateRes.json();
    
    if (rateData.success && rateData.quotes?.USDVND) {
      USD_TO_VND = rateData.quotes.USDVND;
    }
  } catch (error) {
    console.error("Exchange rate API error, using fallback:", error);
  }

  // Calculate amount in VND (VNPay requires amount in VND)
  const amountInVND = product.price * USD_TO_VND * qty;
  const amountForVNPay = Math.round(amountInVND); // VNPay uses VND unit

  // Prepare payment parameters
  const params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Amount: amountForVNPay * 100, // VNPay requires amount in subunits (multiply by 100)
    vnp_BankCode: "",
    vnp_CreateDate: new Date().toISOString().replace(/[-:]/g, "").split(".")[0], // Format: yyyyMMddHHmmss
    vnp_CurrCode: "VND",
    vnp_IpAddr: req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1',
    vnp_Locale: "vn",
    vnp_OrderInfo: `Payment for ${product.name} x${qty}`,
    vnp_OrderType: "other",
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_TxnRef: `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  };

  // Sort parameters alphabetically for VNPay
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});

  // Create sign data
  const signData = querystring.stringify(sortedParams, { encode: false });

  // Generate secure hash (SHA512 for VNPay)
  const secureHash = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(signData)
    .digest("hex");

  // Create payment URL
  const paymentUrl = `${vnp_Url}?${signData}&vnp_SecureHash=${secureHash}`;

  // Return response with clear amount information
  const response = {
    url: paymentUrl,
    amounts: {
      display: {
        originalUSD: product.price * qty,
        convertedVND: amountInVND,
        formattedVND: new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(amountInVND)
      },
      technical: {
        vnpayAmount: amountForVNPay * 100, // The actual value sent to VNPay
        explanation: "VNPay requires amount in subunits (1 VND = 100 subunits)"
      }
    },
    exchangeRate: USD_TO_VND,
    currency: "VND"
  };

  if (process.env.NODE_ENV === 'development') {
    response.debug = {
      params: sortedParams,
      signData,
      secureHash
    };
  }

  res.status(200).json(response);
}