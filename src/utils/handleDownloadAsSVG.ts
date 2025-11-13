export const handleDownloadAsSVG = (svgId: string, username: string) => {
    const svg = document.querySelector(`#${svgId}`) as SVGSVGElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${username}-avatar.svg`;
    link.click();

    URL.revokeObjectURL(url);
};
