export const imageLoadPromise = async (img: HTMLImageElement): Promise<void> => new Promise(resolve => {
    img.addEventListener('load', () => resolve());
});
