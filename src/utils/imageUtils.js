/**
 * Image processing utilities for Carely avatars and document previews.
 */

/**
 * Compresses an image file to max dimensions and converts to an optimized base64 data URL.
 * Produces lightweight (~30KB-60KB) high-quality JPEG avatars for persistent, fast storage.
 *
 * @param {File} file - Browser File object from file input
 * @param {number} maxWidth - Maximum output width (default 400px)
 * @param {number} maxHeight - Maximum output height (default 400px)
 * @param {number} quality - JPEG compression quality 0.1 to 1.0 (default 0.85)
 * @returns {Promise<string>} Base64 Data URL string ('data:image/jpeg;base64,...')
 */
export function compressAndReadImage(file, maxWidth = 400, maxHeight = 400, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided.'));
    }

    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image (JPEG, PNG, WEBP).'));
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        let { width, height } = img;

        // Calculate proportional scale
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context unavailable');
        }

        // Fill background with white in case PNG has transparent pixels
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      } catch (err) {
        console.warn('Canvas image compression fallback to raw data URL:', err);
        fallbackFileReader(file, resolve, reject);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      fallbackFileReader(file, resolve, reject);
    };

    img.src = objectUrl;
  });
}

function fallbackFileReader(file, resolve, reject) {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Failed to read image file.'));
  reader.readAsDataURL(file);
}
