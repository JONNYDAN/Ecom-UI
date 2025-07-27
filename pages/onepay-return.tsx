import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface OnePayResponse {
  vpc_Amount?: string;
  vpc_BatchNo?: string;
  vpc_Version?: string;
  vpc_OrderInfo?: string;
  vpc_Command?: string;
  vpc_Merchant?: string;
  vpc_Message?: string;
  vpc_Card?: string;
  vpc_SecureHash?: string;
  vpc_CardNum?: string;
  vpc_AVS_PostCode?: string;
  vpc_MerchTxnRef?: string;
  vpc_TransactionNo?: string;
  vpc_VerType?: string;
  vpc_VerSecurityLevel?: string;
  vpc_AVS_StateProv?: string;
  vpc_Locale?: string;
  vpc_TxnResponseCode?: string;
  [key: string]: string | undefined;
}

const responseCodes: Record<string, string> = {
  '0': 'Giao dịch thành công',
  '1': 'Ngân hàng từ chối giao dịch',
  '2': 'Ngân hàng từ chối giao dịch',
  '3': 'Mã đơn vị không tồn tại',
  '4': 'Không đúng access code',
  '5': 'Số tiền không hợp lệ',
  '6': 'Mã tiền tệ không tồn tại',
  '7': 'Lỗi không xác định',
  '8': 'Số thẻ không đúng',
  '9': 'Tên chủ thẻ không đúng',
  'A': 'Giao dịch bị hủy',
  'B': 'Thẻ hết hạn/Thẻ bị khóa',
  'C': 'Thẻ chưa đăng ký sử dụng dịch vụ',
  'D': 'Ngân hàng từ chối giao dịch (Không liên hệ ngân hàng)',
  'F': 'Xác thực 3D Secure không thành công',
  'Z': 'Giao dịch bị tạm giữ để kiểm tra'
};

const OnepayReturn = () => {
  const router = useRouter();
  const [status, setStatus] = useState('Đang xử lý kết quả thanh toán...');
  const [details, setDetails] = useState<OnePayResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      const query = router.query as OnePayResponse;
      setDetails(query);
      setIsLoading(false);

      // Handle 3D Secure response first
      if (query.vpc_VerType === '3DS') {
        if (query.vpc_VerSecurityLevel !== '06') {
          setStatus('❌ Xác thực 3D Secure không thành công');
          return;
        }
      }

      const code = query.vpc_TxnResponseCode || '';
      const isTestCard = (query.vpc_CardNum || '').includes('400000');
      
      let message = responseCodes[code] || `Mã lỗi không xác định: ${code}`;
      
      if (isTestCard && code === 'D') {
        message = 'Đây là kết quả mong đợi cho thẻ test (luôn từ chối)';
      }

      setStatus(code === '0' 
        ? '✅ Thanh toán thành công!' 
        : `❌ Thanh toán thất bại: ${message}`
      );

      // Verify payment in production
      if (process.env.NODE_ENV === 'production') {
        verifyPayment(query);
      }
    }
  }, [router]);

  async function verifyPayment(params: OnePayResponse) {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error('Verification failed');
      }
      
      const data = await response.json();
      console.log('Kết quả xác minh:', data);
    } catch (error) {
      console.error('Lỗi xác minh thanh toán:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="container">
        <Head>
          <title>Đang xử lý thanh toán...</title>
        </Head>
        <h1>Đang xử lý kết quả thanh toán</h1>
        <p>Vui lòng chờ trong giây lát...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>Kết quả thanh toán</title>
      </Head>
      
      <h1>Kết quả thanh toán</h1>
      <div className="result-message">{status}</div>
      
      {details?.vpc_Amount && (
        <div className="amount-info">
          <p>Số tiền: {formatVND(details.vpc_Amount)}</p>
        </div>
      )}
      
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1rem;
          font-family: Arial, sans-serif;
        }
        .result-message {
          font-size: 1.2rem;
          margin: 1rem 0;
          padding: 1rem;
          background: ${status.includes('✅') ? '#e6ffed' : '#ffebee'};
          border-left: 4px solid ${status.includes('✅') ? '#4CAF50' : '#F44336'};
        }
        .amount-info {
          margin: 1rem 0;
          padding: 1rem;
          background: #e3f2fd;
          border-radius: 4px;
        }
        .debug-info {
          margin-top: 2rem;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 4px;
        }
        .test-cards {
          margin-top: 1rem;
          padding: 1rem;
          background: #fff8e1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

function formatVND(amount: string) {
  // Convert from OnePay format (subunits) to normal VND
  const amountNum = parseInt(amount) / 100;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amountNum);
}

export default OnepayReturn;