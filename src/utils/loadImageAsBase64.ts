import { imageLoadPromise } from '../hooks/imageLoadPromise.ts';

export const loadImageAsBase64 = async (imageUrl: string) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    try {
        image.src = imageUrl;
        await imageLoadPromise(image);
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
