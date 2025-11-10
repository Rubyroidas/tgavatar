export const loadImageAsBase64 = async (imageUrl: string) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    try {
        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
            image.src = imageUrl;
        });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        return canvas.toDataURL('image/png', 100);
    } catch (e) {
        console.error(e);
        return '';
    }
};
