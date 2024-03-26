export async function resizeImage(
  uri: string,
  maxWidth: number = 1600,
  blurRadius: number = 0 // Add a parameter for blur radius
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.src = uri;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const scaleFactor = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scaleFactor;
      if (ctx) {
        // Check if blurRadius is greater than 0, then apply the blur filter
        if (blurRadius > 0) {
          ctx.filter = `blur(${blurRadius}px)`;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Reset filter to default if you're going to draw more things on the canvas later
        ctx.filter = 'none';
      }
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const newUri = URL.createObjectURL(blob);
            resolve(newUri);
          } else {
            reject(new Error("Canvas toBlob returned null"));
          }
        },
        "image/jpeg",
        0.8 // Note: Comment mentions compressing to 70%, but code sets quality to 0.8 (80%)
      );
    };
    img.onerror = (error) => reject(error);
  });
}
