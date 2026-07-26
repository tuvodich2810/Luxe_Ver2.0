import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ImageUploader = ({ value, onChange, label = 'Ảnh' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Chỉ chấp nhận file ảnh JPEG, PNG hoặc WebP';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Kích thước file không được vượt quá 5MB';
    }
    return null;
  };

  const uploadFile = useCallback(
    async (file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError('');
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await api.post('/images/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          },
        });

        onChange(response.data.url);
      } catch (err) {
        setError(err.message || 'Upload ảnh thất bại, vui lòng thử lại');
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <div>
      <label className="block text-xs text-silver mb-2">{label}</label>

      {value && !isUploading ? (
        <div className="relative group">
          <div className="aspect-car bg-black/40 overflow-hidden border border-white/10">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gold text-black font-label text-xs uppercase tracking-wider"
            >
              Đổi ảnh
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 border border-red-400 text-red-400 font-label text-xs uppercase tracking-wider"
            >
              Xóa
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={[
            'aspect-car border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors duration-300',
            isDragging ? 'border-gold bg-gold/5' : 'border-white/15 hover:border-white/30',
            isUploading ? 'cursor-wait' : '',
          ].join(' ')}
        >
          {isUploading ? (
            <div className="w-full px-12 text-center">
              <p className="font-label text-xs text-silver mb-3">Đang tải lên... {uploadProgress}%</p>
              <div className="w-full h-1 bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          ) : (
            <>
              <svg className="w-8 h-8 text-silver/50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="font-label text-xs text-silver text-center px-4">
                Kéo thả ảnh vào đây hoặc <span className="text-gold">chọn file</span>
              </p>
              <p className="text-[10px] text-silver/50 mt-1">JPEG, PNG, WebP — tối đa 5MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-400 text-xs mt-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploader;
