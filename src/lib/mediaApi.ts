import { API_BASE } from './api';
import { ImageCategory } from './imageOptimizer';

export interface UploadResponse {
  success: boolean;
  message: string;
  url: string;
  asset: {
    id: string;
    key: string;
    url: string;
    category: string;
    mimeType: string;
    format: string;
    width: number;
    height: number;
    size: number;
    originalSize: number;
    compressionRatio: string;
    variants?: {
      thumbnail?: {
        url: string;
        width: number;
        height: number;
        size: number;
      };
    };
  };
  metrics?: {
    originalSize: number;
    optimizedSize: number;
    compressionRatio: string;
    dimensions: string;
    format: string;
  };
}

/**
 * Returns full absolute media URL given a relative or absolute asset path.
 */
export function getMediaUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const serverOrigin = API_BASE.replace(/\/api\/?$/, '');
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${serverOrigin}${cleanPath}`;
}

/**
 * Uploads an image file to the backend media optimization service with progress reporting.
 */
export async function uploadMediaFile(
  file: File | Blob,
  category: ImageCategory = 'GENERAL',
  onProgress?: (progressPercent: number) => void
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file, (file as File).name || 'upload.webp');
    formData.append('category', category);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/media/upload`, true);

    const token = typeof window !== 'undefined' ? localStorage.getItem('rydra_admin_token') : null;
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          // Normalize URL to absolute
          response.url = getMediaUrl(response.url);
          if (response.asset?.url) {
            response.asset.url = getMediaUrl(response.asset.url);
          }
          if (response.asset?.variants?.thumbnail?.url) {
            response.asset.variants.thumbnail.url = getMediaUrl(response.asset.variants.thumbnail.url);
          }
          resolve(response as UploadResponse);
        } else {
          reject(new Error(response.error || `Upload failed with HTTP status ${xhr.status}`));
        }
      } catch {
        reject(new Error('Invalid response from media server'));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during media upload'));
    };

    xhr.send(formData);
  });
}
