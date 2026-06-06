import React, { useState, useRef } from 'react';
import { ocrService } from '../services/api';

const InvoiceUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image file first.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('invoice', file);

    try {
      const response = await ocrService.extractText(formData);
      onUploadSuccess(response.data.data);
      // Reset
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError('Failed to extract text. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow text-center border-2 border-dashed border-gray-300">
      <h2 className="text-xl font-semibold mb-4">Upload Invoice</h2>
      <input 
        type="file" 
        accept="image/jpeg, image/png, image/jpg" 
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current.click()}
          className="cursor-pointer py-12 flex flex-col items-center justify-center hover:bg-gray-50 rounded"
        >
          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          <p className="text-gray-500">Click to select an image (JPG, PNG)</p>
        </div>
      ) : (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded mb-4" />
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => { setFile(null); setPreview(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              onClick={handleUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : 'Extract Text'}
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default InvoiceUploader;
