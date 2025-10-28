// pages/vnpay-return.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

interface VNPayReturnData {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

interface PaymentResult {
  success: boolean;
  message: string;
  amount?: number;
  orderInfo?: string;
  transactionNo?: string;
  bankCode?: string;
  payDate?: string;
}

export default function VNPayReturn() {
  const router = useRouter();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!router.isReady) return;

      const queryParams = router.query as unknown as VNPayReturnData;
      
      if (Object.keys(queryParams).length === 0) {
        setPaymentResult({
          success: false,
          message: 'Không có dữ liệu thanh toán'
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/verify-vnpay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(queryParams),
        });

        const result = await response.json();

        if (response.ok) {
          setPaymentResult(result);
        } else {
          setPaymentResult({
            success: false,
            message: result.error || 'Lỗi xác thực thanh toán'
          });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentResult({
          success: false,
          message: 'Lỗi kết nối đến server'
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [router.isReady, router.query]);

  const formatAmount = (amount: string) => {
    // VNPay trả về amount dạng subunit (x100)
    const numericAmount = parseInt(amount) / 100;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numericAmount);
  };

  const formatDate = (payDate: string) => {
    // Format: yyyyMMddHHmmss
    const year = payDate.substring(0, 4);
    const month = payDate.substring(4, 6);
    const day = payDate.substring(6, 8);
    const hour = payDate.substring(8, 10);
    const minute = payDate.substring(10, 12);
    const second = payDate.substring(12, 14);
    
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Head>
          <title>Đang xử lý thanh toán...</title>
        </Head>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang xác thực thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Kết quả thanh toán</title>
      </Head>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className={`p-6 ${paymentResult?.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="text-center">
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${paymentResult?.success ? 'bg-green-100' : 'bg-red-100'}`}>
              {paymentResult?.success ? (
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              {paymentResult?.success ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
            </h2>
            
            <p className="mt-2 text-gray-600">
              {paymentResult?.message}
            </p>
          </div>
        </div>

        {paymentResult?.success && paymentResult.amount && (
          <div className="border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <div className="px-6 py-4">
                <dt className="text-sm font-medium text-gray-500">Số tiền</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {formatAmount(paymentResult.amount.toString())}
                </dd>
              </div>

              {paymentResult.orderInfo && (
                <div className="px-6 py-4">
                  <dt className="text-sm font-medium text-gray-500">Nội dung</dt>
                  <dd className="mt-1 text-sm text-gray-900">{paymentResult.orderInfo}</dd>
                </div>
              )}

              {paymentResult.transactionNo && (
                <div className="px-6 py-4">
                  <dt className="text-sm font-medium text-gray-500">Mã giao dịch</dt>
                  <dd className="mt-1 text-sm text-gray-900">{paymentResult.transactionNo}</dd>
                </div>
              )}

              {paymentResult.bankCode && (
                <div className="px-6 py-4">
                  <dt className="text-sm font-medium text-gray-500">Ngân hàng</dt>
                  <dd className="mt-1 text-sm text-gray-900">{paymentResult.bankCode}</dd>
                </div>
              )}

              {paymentResult.payDate && (
                <div className="px-6 py-4">
                  <dt className="text-sm font-medium text-gray-500">Thời gian</dt>
                  <dd className="mt-1 text-sm text-gray-900">{paymentResult.payDate}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        <div className="px-6 py-4 bg-gray-50">
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Về trang chủ
            </button>
            <button
              onClick={() => router.push('/orders')}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Xem đơn hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}