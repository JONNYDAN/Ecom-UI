// pages/onepay-return.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const OnepayReturn = () => {
  const router = useRouter();
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const query = router.query;

      // Kiểm tra kết quả thanh toán dựa trên query trả về từ OnePay
      const responseCode = query.vpc_TxnResponseCode;
      if (responseCode === '0') {
        setStatus('✅ Thanh toán thành công!');
      } else {
        setStatus('❌ Thanh toán thất bại hoặc bị hủy.');
      }

      // Bạn có thể gửi các tham số này về backend để xác thực thêm
      console.log('OnePay response:', query);
    }
  }, [router]);

 return (
  <div style={{ padding: '2rem' }}>
    <h1>Kết quả thanh toán</h1>
    <p>{status}</p>
    <pre>{JSON.stringify(router.query, null, 2)}</pre>
  </div>
);

};

export default OnepayReturn;
