export type ImageCategory =
  | 'AVATAR'
  | 'THUMBNAIL'
  | 'DOCUMENT'
  | 'PRODUCT'
  | 'COVER'
  | 'PLACE'
  | 'BANNER'
  | 'GENERAL';

export interface ImageOptimizationProfile {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  targetSizeKb: [number, number];
  squareCrop?: boolean;
}

export const WEB_IMAGE_PROFILES: Record<ImageCategory, ImageOptimizationProfile> = {
  AVATAR: {
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.85,
    targetSizeKb: [100, 150],
    squareCrop: true,
  },
  THUMBNAIL: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.8,
    targetSizeKb: [50, 80],
    squareCrop: true,
  },
  DOCUMENT: {
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.85,
    targetSizeKb: [150, 300],
    squareCrop: false,
  },
  PRODUCT: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.82,
    targetSizeKb: [100, 250],
    squareCrop: false,
  },
  COVER: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.82,
    targetSizeKb: [250, 450],
    squareCrop: false,
  },
  PLACE: {
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.8,
    targetSizeKb: [150, 300],
    squareCrop: false,
  },
  BANNER: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.82,
    targetSizeKb: [250, 450],
    squareCrop: false,
  },
  GENERAL: {
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.8,
    targetSizeKb: [150, 300],
    squareCrop: false,
  },
};

export interface OptimizationResult {
  file: File;
  previewUrl: string;
  originalSize: number;
  optimizedSize: number;
  reductionPercent: number;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  mimeType: string;
}

/**
 * Optimizes an image client-side before sending it to the backend.
 * Provides instant feedback, saves mobile/cellular bandwidth, and enforces the standard.
 */
export async function optimizeImageClient(
  file: File,
  category: ImageCategory = 'GENERAL'
): Promise<OptimizationResult> {
  const originalSize = file.size;
  const profile = WEB_IMAGE_PROFILES[category] || WEB_IMAGE_PROFILES.GENERAL;

  // If already SVG vector, preserve vector content directly
  if (file.type === 'image/svg+xml') {
    return {
      file,
      previewUrl: URL.createObjectURL(file),
      originalSize,
      optimizedSize: originalSize,
      reductionPercent: 0,
      originalWidth: 0,
      originalHeight: 0,
      width: 0,
      height: 0,
      mimeType: 'image/svg+xml',
    };
  }

  // Load image into HTML Image object
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image file into DOM'));
      image.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file buffer'));
    reader.readAsDataURL(file);
  });

  const originalWidth = img.naturalWidth || img.width;
  const originalHeight = img.naturalHeight || img.height;

  let targetWidth = originalWidth;
  let targetHeight = originalHeight;
  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = originalWidth;
  let sourceHeight = originalHeight;

  if (profile.squareCrop) {
    // 1:1 Aspect Ratio Crop for Avatars
    const minDim = Math.min(originalWidth, originalHeight);
    sourceX = (originalWidth - minDim) / 2;
    sourceY = (originalHeight - minDim) / 2;
    sourceWidth = minDim;
    sourceHeight = minDim;

    const finalDim = Math.min(minDim, profile.maxWidth);
    targetWidth = finalDim;
    targetHeight = finalDim;
  } else {
    // Proportional downscale if exceeding profile limits
    if (originalWidth > profile.maxWidth || originalHeight > profile.maxHeight) {
      const ratio = Math.min(profile.maxWidth / originalWidth, profile.maxHeight / originalHeight);
      targetWidth = Math.round(originalWidth * ratio);
      targetHeight = Math.round(originalHeight * ratio);
    }
  }

  // Create canvas for high-quality resampling
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context is unavailable in this environment');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    img,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight
  );

  // Determine output format: WebP preferred, JPEG fallback
  let exportMime = 'image/webp';
  let blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), exportMime, profile.quality)
  );

  // If browser does not support WebP canvas export, fallback to JPEG
  if (!blob || blob.type !== 'image/webp') {
    exportMime = 'image/jpeg';
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), exportMime, profile.quality)
    );
  }

  if (!blob) {
    throw new Error('Failed to compress image canvas to blob');
  }

  const extension = exportMime === 'image/webp' ? 'webp' : 'jpg';
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const optimizedFileName = `${baseName}_optimized.${extension}`;
  const optimizedFile = new File([blob], optimizedFileName, {
    type: exportMime,
    lastModified: Date.now(),
  });

  const optimizedSize = optimizedFile.size;
  const reductionPercent =
    originalSize > optimizedSize
      ? Math.round(((originalSize - optimizedSize) / originalSize) * 100)
      : 0;

  const previewUrl = URL.createObjectURL(optimizedFile);

  return {
    file: optimizedFile,
    previewUrl,
    originalSize,
    optimizedSize,
    reductionPercent,
    originalWidth,
    originalHeight,
    width: targetWidth,
    height: targetHeight,
    mimeType: exportMime,
  };
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
