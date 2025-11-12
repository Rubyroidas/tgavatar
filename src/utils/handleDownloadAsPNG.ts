import { imageLoadPromise } from '../hooks/imageLoadPromise';

export const handleDownloadAsPNG = async (username: string) => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;
    const size = svgElement.getBBox();

    // Clone the SVG element to avoid modifying the original
    const svg = svgElement.cloneNode(true) as SVGSVGElement;

    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d')!;
    const outerHTML = svg.outerHTML;
    const blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(blob);

    const image = new Image();
    image.src = blobURL;
    await imageLoadPromise(image);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Draw image to fill canvas
    URL.revokeObjectURL(blobURL);

    const url = canvas.toDataURL('image/png', 100);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${username}-avatar.png`;
    link.click();
};
