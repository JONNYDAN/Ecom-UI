import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  const { product, qty } = req.body;

  // OnePay configuration
  const onepay_Merchant = process.env.ONEPAY_MERCHANT_ID;
  const onepay_AccessCode = process.env.ONEPAY_ACCESS_CODE;
  const onepay_Secret = process.env.ONEPAY_SECRET;
  const onepay_Url = "https://mtf.onepay.vn/vpcpay/vpcpay.op";
  const onepay_ReturnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/onepay-return`;

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

  // Calculate amount in VND (OnePay requires amount in smallest VND unit)
  const amountInVND = product.price * USD_TO_VND * qty;
  const amountForOnePay = Math.round(amountInVND) * 100; // Convert to smallest unit

  // Prepare payment parameters
  const params = {
    vpc_Version: "2",
    vpc_Command: "pay",
    vpc_Merchant: onepay_Merchant,
    vpc_AccessCode: onepay_AccessCode,
    vpc_MerchTxnRef: `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    vpc_OrderInfo: `Payment for ${product.name} x${qty}`,
    vpc_Amount: amountForOnePay.toString(),
    vpc_Currency: "VND",
    vpc_Locale: "vn",
    vpc_ReturnURL: onepay_ReturnUrl,
    vpc_TicketNo: req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1',
    vpc_Customer_Phone: req.body.phone || '',
    vpc_Customer_Email: req.body.email || '',
    vpc_Title: "E-commerce Payment",
  };

  // Filter out empty parameters
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '')
  );

  // Sort parameters alphabetically
  const sortedParams = Object.keys(filteredParams)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: filteredParams[key] }), {});

  // Create string to sign
  const signData = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  // Generate secure hash
  const secureHash = crypto
    .createHmac("sha256", onepay_Secret)
    .update(signData)
    .digest("hex")
    .toUpperCase();

  // Create payment URL
  const paymentUrl = `${onepay_Url}?${signData}&vpc_SecureHash=${secureHash}`;

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
        onePayAmount: amountForOnePay, // The actual value sent to OnePay
        explanation: "OnePay requires amount in smallest VND unit (1 VND = 100 subunits)"
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