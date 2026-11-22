"use client";

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import {
  optimizeImageClient,
  ImageCategory,
  OptimizationResult,
  formatBytes,
} from '@/lib/imageOptimizer';
import { uploadMediaFile, UploadResponse } from '@/lib/mediaApi';

interface ImageUploadProps {
  category?: ImageCategory;
  currentImageUrl?: string | null;
  onUploadSuccess?: (url: string, response: UploadResponse) => void;
  className?: string;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  category = 'AVATAR',
  currentImageUrl = null,
  onUploadSuccess,
  className = '',
  label = 'Upload Image',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentImageUrl);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WebP, SVG)');
      return;
    }

    try {
      setIsOptimizing(true);
      const result = await optimizeImageClient(file, category);
      setOptimizationResult(result);
      setIsOptimizing(false);

      // Automatically execute upload of optimized asset
      setIsUploading(true);
      setUploadProgress(0);

      const response = await uploadMediaFile(result.file, category, (pct) => {
        setUploadProgress(pct);
      });

      setUploadedUrl(response.url);
      setIsUploading(false);
      onUploadSuccess?.(response.url, response);
    } catch (err: any) {
      setIsOptimizing(false);
      setIsUploading(false);
      setErrorMessage(err.message || 'Image optimization or upload failed');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setOptimizationResult(null);
    setUploadedUrl(null);
    setErrorMessage(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayUrl = optimizationResult?.previewUrl || uploadedUrl || currentImageUrl;

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label} <span className="text-[10px] text-slate-500 font-normal">({category} standard)</span>
        </label>
      )}

      {/* Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer select-none overflow-hidden ${
          isDragging
            ? 'border-[#10b982] bg-[#10b982]/10'
            : 'border-slate-700/80 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-800/40'
        } ${isUploading ? 'opacity-80 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelected(e.target.files[0]);
            }
          }}
        />

        {displayUrl ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayUrl}
                alt="Uploaded Preview"
                className="w-full h-full object-cover"
              />
              {uploadedUrl && !isUploading && (
                <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                  <CheckCircle2 size={12} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">
                {optimizationResult?.file.name || 'Current Image'}
              </p>
              {optimizationResult ? (
                <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-400">
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-semibold">
                    {formatBytes(optimizationResult.optimizedSize)}
                  </span>
                  <span className="line-through text-slate-500">
                    {formatBytes(optimizationResult.originalSize)}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    -{optimizationResult.reductionPercent}%
                  </span>
                  <span className="text-slate-500">
                    ({optimizationResult.width}×{optimizationResult.height})
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click or drag a new image to replace
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              title="Remove image"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
              <UploadCloud size={24} className="text-[#10b982]" />
            </div>
            <p className="text-xs font-bold text-slate-200">
              Drop an image here, or <span className="text-[#10b982]">browse</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Auto-converts to WebP • Preserves quality • Strips EXIF metadata
            </p>
          </div>
        )}

        {/* Upload Progress Overlay */}
        {(isOptimizing || isUploading) && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-4">
            <RefreshCw size={22} className="text-[#10b982] animate-spin mb-2" />
            <p className="text-xs font-bold text-slate-200">
              {isOptimizing ? 'Optimizing & resizing canvas...' : `Uploading (${uploadProgress}%)...`}
            </p>
            <div className="w-48 bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-[#10b982] h-full transition-all duration-200"
                style={{ width: `${isOptimizing ? 40 : uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
