import { useEffect, useState } from 'react';
import styles from './App.module.css';

type AvatarProps = {
    url: string;
    text: string;
    borderColor: string;
    borderWidth: number;
    textColor: string;
};
const Avatar = ({ url, text, borderColor, borderWidth, textColor }: AvatarProps) => {
    const size = 300;
    const radius = size / 2;
    return (
        <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" className={styles.avatarPreview}>
            <defs>
                <mask id="combinedMask">
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="white"/>
                    <circle cx={size / 2} cy={size / 2} r={radius - borderWidth} fill="black"/>

                    <path
                        d="M 236.0 276.4 A 150 150 0 0 1 -1.0 201.3 L 236.0 276.4 Z"
                        fill="white"
                    />
                </mask>
                <mask id="avatarMask">
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="white"/>
                </mask>

                <path id="textPath" d="M 236.0 276.4 L -1.0 201.3" fill="none"/>
            </defs>

            <image
                href={url}
                x={0}
                y={0}
                width={size}
                height={size}
                mask="url(#avatarMask)"
            />

            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill={borderColor}
                mask="url(#combinedMask)"
            />

            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={borderColor}
                strokeWidth="1"
                mask="url(#combinedMask)"
            />

            <text
                fill={textColor}
                fontSize="48"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
                transform="translate(-10 40) rotate(180 117.5 238.85)">
                <textPath href="#textPath" startOffset="50%" textAnchor="middle">
                    {text}
                </textPath>
            </text>
        </svg>

    );
}

const loadImageAsBase64 = async (imageUrl: string) => {
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

export const App = () => {
    const [ userProfileLink, setUserProfileLink ] = useState('@durov');
    const [ username, setUsername ] = useState('');
    const [ userAvatarUrl, setUserAvatarUrl ] = useState('');
    const [ text, setText ] = useState('SAMPLE TEXT');
    const [ borderWidth, setBorderWidth ] = useState(12);
    const [ borderColor, setBorderColor ] = useState('#ff0000');
    const [ textColor, setTextColor ] = useState('#ffffff');

    const loadUserAvatarUrl = async (username: string) => {
        const originalUrl = `https://t.me/i/userpic/320/${username}.jpg`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
        try {
            // const { url } = await loadImageAsBlob(proxyUrl);
            const url = await loadImageAsBase64(proxyUrl);
            setUserAvatarUrl(url);
        } catch (e) {
            setUserAvatarUrl(originalUrl);
        }
    };

    useEffect(() => {
        const regex = /^(?:(?:https:\/\/)?t\.me\/|@)(.+)$/;
        const match = regex.exec(userProfileLink.trim());

        if (match) {
            const username = match[ 1 ];
            setUsername(username);
        }
    }, [ userProfileLink ]);

    useEffect(() => {
        if (username) {
            loadUserAvatarUrl(username);
        }
    }, [ username ]);

    const handleDownloadAsSVG = () => {
        const svg = document.querySelector('svg');
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

    const handleDownloadAsPNG = () => {
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
        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Draw image to fill canvas
            URL.revokeObjectURL(blobURL);

            const url = canvas.toDataURL('image/png', 100);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${username}-avatar.png`;
            link.click();
        };
        image.src = blobURL;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                Telegram avatar border builder
            </div>
            <div className={styles.field}>
                <label>User profile</label>
                <input
                    value={userProfileLink}
                    onChange={(e) => setUserProfileLink(e.target.value)}
                />
            </div>
            <div className={styles.field}>
                <label>Text</label>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <div className={styles.field}>
                <label>Border color</label>
                <div className={styles.fieldValuePreview}>
                    {borderColor}
                </div>
                <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                />
            </div>
            <div className={styles.field}>
                <label>Border width</label>
                <div className={styles.fieldValuePreview}>
                    {borderWidth}
                </div>
                <input
                    type="range"
                    value={borderWidth}
                    min={5}
                    max={50}
                    step={1}
                    onChange={(e) => setBorderWidth(parseInt(e.target.value, 10))}
                />
            </div>
            <div className={styles.field}>
                <label>Text color</label>
                <div className={styles.fieldValuePreview}>
                    {textColor}
                </div>
                <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                />
            </div>
            <div className="downloads">
                <button onClick={handleDownloadAsSVG}>
                    SVG Download
                </button>
                <button onClick={handleDownloadAsPNG}>
                    PNG Download
                </button>
            </div>
            <div>
                {userAvatarUrl && (
                    <Avatar
                        url={userAvatarUrl}
                        text={text}
                        borderColor={borderColor}
                        borderWidth={borderWidth}
                        textColor={textColor}
                    />
                )}
            </div>
        </div>
    );
};
