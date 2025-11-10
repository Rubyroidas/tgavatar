export const cutCanvasToSquare = (sourceCanvas: HTMLCanvasElement): HTMLCanvasElement => {
    const size = Math.min(sourceCanvas.width, sourceCanvas.height);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = size;
    canvas.height = size;

    const sx = (sourceCanvas.width - size) / 2;
    const sy = (sourceCanvas.height - size) / 2;

    ctx.drawImage(sourceCanvas, sx, sy, size, size, 0, 0, size, size);

    return canvas;
};
