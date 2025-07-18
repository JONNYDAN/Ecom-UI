import { useState } from 'react';

const ImageUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0); // có thể xoá nếu không dùng firebase
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // Hàm chuyển Google Drive view URL → thumbnail URL
  function formatDriveLink(rawUrl: string): string | null {
    const match = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://drive.google.com/thumbnail?id=${match[1]}`;
    }
    return null;
  }

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result?.toString().split(',')[1];

      const url = 'https://script.google.com/macros/s/AKfycbwn3A6F_-j-7aJybUmbFMHzJ4d7MlbyUzGRSs4y4Xfs7Cwu75di5-b0YUXDdHPr-RHjBw/exec';
      const res = await fetch(url, {
        method: 'POST',
        body: base64,
      });

      const rawUrl = await res.text(); // Google Drive link
      const thumbUrl = formatDriveLink(rawUrl); // chuyển sang thumbnail
      if (thumbUrl) {
        setDownloadURL(thumbUrl);
        alert('Upload thành công!');
      } else {
        alert('Không thể tạo link thumbnail từ URL trả về.');
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload hình
      </button>
      {progress > 0 && <p>Tiến độ: {progress}%</p>}
      {downloadURL && (
        <div>
          <p>Link ảnh:</p>
          <a href={downloadURL} target="_blank" rel="noopener noreferrer">
            {downloadURL}
          </a>
          <img src={downloadURL} alt="Uploaded" style={{ width: 200, marginTop: 10 }} />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
