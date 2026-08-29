// resize image up 1200px and applies high contrast grayscale filtering
export async function  preprocessImage(file: File): Promise<Blob> {
    return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                return resolve(file); // if raw file unavailable
            }
            // max dimension for high res image
            const MAX_DIM = 1200;
            let width = img.width;
            let height = img.height;
    
            if (width > MAX_DIM || height > MAX_DIM) {
                if (width > height){
                    height = Math.round((height * MAX_DIM) / width);
                    width = MAX_DIM
                } else {
                    width = Math.round((width * MAX_DIM) / height);
                    height = MAX_DIM
                }
            }
            
            canvas.width = width;
            canvas.height = height;

            // draw original canvas
            ctx.drawImage(img, 0, 0, width, height);
            
            const imgData = ctx.getImageData(0, 0, width, height);
            const d = imgData.data;

            for(let i = 0; i < d.length; i += 4) {
                // calculate grayscale luminance RGB
                const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];

                const contrastFactor = 1.4;
                let adjusted = (gray - 128) * contrastFactor + 128;
                adjusted = Math.min(255, Math.max(0, adjusted));

                d[i] = adjusted; // red
                d[i + 1] = adjusted; // green
                d[i + 2] = adjusted; // blue
            }

            ctx.putImageData(imgData, 0, 0);

            // export canvas to blob
            canvas.toBlob((blob) => {
                resolve(blob || file);
            }, "image/png");
        };

        img.onerror = () => resolve(file);
        img.src = objectUrl;
    });
}

// crops the center of an image to remove bg noise
export async function cropCenterImage(file: File): Promise<Blob> {
    return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) return resolve(file);

            // calculate center
            const cropWidth = img.width * 0.7;
            const cropHeight = img.height * 0.7;
            const startX = (img.width - cropWidth) / 2;
            const startY = (img.height - cropHeight) / 2;

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            ctx.drawImage(
                img,
                startX, startY, cropWidth, cropHeight, // source crop rectangle
                0, 0, cropWidth, cropHeight // Canvas destination
            );
        };

        img.onerror = () => resolve(file);
        img.src = objectUrl;
    })
}

// function to see debugged image
export function downloadDebugImage(blobOrFile: Blob | File, filename: string) {
  const url = URL.createObjectURL(blobOrFile);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); 
}