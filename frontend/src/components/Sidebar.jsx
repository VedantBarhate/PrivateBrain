import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Trash2, FileText, Loader2, File } from 'lucide-react';

export default function Sidebar() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_BACKEND_API_URL;

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/list-files`);
      if (res.data && res.data.files) {
        setFiles(res.data.files);
      }
    } catch (e) {
      console.error('Failed to fetch files:', e);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (file) => {
    if (files.length >= 5) {
      setError("Maximum 5 files allowed.");
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      setError("Only .pdf, .docx, and .txt files are allowed.");
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      await axios.post(`${API_BASE}/add-file`, formData);
      await fetchFiles();
    } catch (e) {
      console.error('Upload failed', e);
      setError("Upload failed. Make sure backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = async (filePath) => {
    try {
      const filename = filePath.split('/').pop().split('\\').pop();
      await axios.delete(`${API_BASE}/remove-file`, {
        params: { filename }
      });
      await fetchFiles();
    } catch (e) {
      console.error('Remove failed', e);
    }
  };

  return (
    <div className="w-64 md:w-80 h-full flex flex-col bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 overflow-hidden shadow-2xl shrink-0">
      <div className="mb-6 mt-2">
        <h2 className="text-xl font-semibold text-white/90 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" /> Documents
        </h2>
        <p className="text-xs text-gray-400 mt-2">Upload up to 5 files (.pdf, .docx, .txt)</p>
      </div>

      <div
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out cursor-pointer mb-6 shrink-0
          ${dragActive ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/10 bg-black/20 hover:border-indigo-400/50'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          disabled={uploading || files.length >= 5}
          accept=".pdf,.docx,.txt"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3 text-indigo-300">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium text-center">Click or Drag Files</span>
          </div>
        )}
      </div>

      {error && (
        <div className="text-xs text-red-400 mb-4 bg-red-400/10 p-2 rounded-lg border border-red-400/20">{error}</div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
        {files.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-center mt-4">No documents uploaded.</p>
        ) : (
          files.map((file, i) => {
            const fileName = file.split('/').pop().split('\\').pop();
            return (
              <div key={i} className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-lg group hover:border-indigo-400/30 transition-all">
                <div className="flex items-center gap-3 overflow-hidden">
                  <File className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="truncate text-sm text-gray-200" title={fileName}>{fileName}</span>
                </div>
                <button
                  onClick={() => handleRemove(file)}
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
