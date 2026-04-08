import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { UploadCloud, File, Trash2, Loader2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const API_BASE = 'http://localhost:8000';

export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      await handleUpload(droppedFile);
    }
  }, []);

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      await axios.post(`${API_BASE}/add-file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchFiles();
    } catch (e) {
      console.error('Upload failed', e);
      alert("Failed to upload: Make sure your backend runs on port 8000 and is alive.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (filePath) => {
    try {
      await axios.delete(`${API_BASE}/remove-file`, {
        data: { file_path: filePath }
      });
      await fetchFiles();
    } catch (e) {
      console.error('Remove failed', e);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto backdrop-blur-xl bg-black/30 border border-white/10 rounded-[32px] p-8 lg:p-10 shadow-2xl backdrop-saturate-[1.5]">
      <div
        className={`relative group flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
          ${isDragActive ? 'border-purple-400 bg-purple-500/10' : 'border-white/20 bg-black/40 hover:border-purple-400/50 hover:bg-white/5'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleFileInput}
          disabled={uploading}
        />

        {uploading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 text-purple-300"
          >
            <Loader2 className="w-12 h-12 animate-spin" />
            <p className="font-medium tracking-wide">Embedding Knowledge...</p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-5 text-gray-300 group-hover:text-purple-200 transition-colors">
            <div className="p-5 bg-white/5 rounded-full group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
              <UploadCloud className="w-10 h-10" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-xl mb-1">Click to Upload or Drag and Drop</p>
              <p className="text-sm opacity-60">Add documents to your private AI brain</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 overflow-hidden">
        <h3 className="text-xl font-medium text-white/90 flex items-center gap-2 mb-6 ml-2">
          <Database className="w-5 h-5 text-purple-400" />
          Neural Memory Base
        </h3>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence>
            {files.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-400 py-6 italic ml-2 text-sm"
              >
                Your brain is currently empty. Upload some files to start!
              </motion.p>
            )}
            {files.map((file, i) => (
              <motion.div
                key={file}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-purple-400/30 hover:bg-purple-900/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4 overflow-hidden text-gray-200">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <File className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  </div>
                  <span className="truncate text-sm font-medium tracking-wide" title={file}>{file.split('/').pop().split('\\').pop()}</span>
                  <span className="hidden opacity-0" title={file}>{file}</span>
                </div>
                <button
                  onClick={() => handleRemove(file)}
                  className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-400/20 rounded-xl transition-all"
                  title="Remove from Brain"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
