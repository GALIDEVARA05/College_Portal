import React, { useState } from 'react';
import axios from 'axios';
import { Upload } from 'lucide-react';

const UploadPDF = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a PDF file');

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setUploading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/upload-pdf`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 300000,
        }
      );
      setResult(res.data);
      alert('Upload successful: ' + (res.data.count || 0) + ' students processed');
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Results PDF</h2>

        <form onSubmit={handleUpload} className="space-y-6">
<div
  className="animated-border relative p-10 bg-gray-50 hover:bg-gray-100 transition cursor-pointer flex flex-col items-center"
  onDragOver={(e) => e.preventDefault()}
  onDrop={handleDrop}
>
  <div className="inner-content flex flex-col items-center justify-center text-center">
    {/* Upload Icon - properly stacked */}
    <div className="mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 text-indigo-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-4 4m4-4l4 4"
        />
      </svg>
    </div>

    <p className="text-gray-600 mb-2">Drag & Drop your PDF here, or</p>

    <label
      htmlFor="file-upload"
      className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700"
    >
      Choose File
    </label>

    <input
      id="file-upload"
      type="file"
      accept="application/pdf"
      onChange={handleFileChange}
      className="hidden"
    />

    {file && <p className="mt-3 text-sm text-gray-700">Selected: {file.name}</p>}
  </div>

  {/* Animated dashed border */}
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <rect x="1.5" y="1.5" width="97" height="97" />
  </svg>
</div>





          {/* Upload button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload and Parse'}
          </button>
        </form>

        {/* Result Preview */}
        {result && (
          <div className="mt-6 p-4 border rounded bg-gray-50 max-h-64 overflow-y-auto">
            <h3 className="font-semibold mb-2">Result</h3>
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPDF;
