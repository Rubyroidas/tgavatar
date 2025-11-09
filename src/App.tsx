import { useEffect, useState } from 'react';
import { Avatar, R } from './Avatar';
import styles from './App.module.css';

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
    const [ text, setText ] = useState('GD');
    const [ fontSize, setFontSize ] = useState(48);
    const [ labelDistance, setLabelDistance ] = useState(80);
    const [ labelAngle, setLabelAngle ] = useState(108);
    const [ borderWidth, setBorderWidth ] = useState(12);
    const [ borderColor, setBorderColor ] = useState('#ff0000');
    const [ textColor, setTextColor ] = useState('#ffffff');

    const loadUserAvatarUrl = async (username: string) => {
        const originalUrl = `https://t.me/i/userpic/320/${username}.jpg`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
        try {
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
                <button className={styles.usernameHelpButton} popoverTarget="usernameHelp">❔</button>
                <input
                    value={userProfileLink}
                    title="Paste Telegram profile link or username"
                    onChange={(e) => setUserProfileLink(e.target.value)}
                />
            </div>
            <div className={styles.usernamePopover} id="usernameHelp" popover="hint">
                User profile should be either:
                <ul>
                    <li>
                        <code>@durov</code>
                    </li>
                    <li>
                        OR <code>https://t.me/durov</code>
                    </li>
                    <li>
                        OR <code>t.me/durov</code>
                    </li>
                </ul>
            </div>
            <div className={styles.fieldGroup}>
                <label>Text</label>
                <div className={styles.field}>
                    <label>Color</label>
                    <div className={styles.fieldValuePreview}>
                        {textColor}
                    </div>
                    <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
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
                    <label>Font size</label>
                    <input
                        type="range"
                        value={fontSize}
                        min={10}
                        max={100}
                        step={1}
                        onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                    />
                </div>
            </div>
            <div className={styles.fieldGroup}>
                <label>Border</label>
                <div className={styles.field}>
                    <label>Color</label>
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
                    <label>Width</label>
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
            </div>
            <div className={styles.fieldGroup}>
                <label>Label</label>
                <div className={styles.field}>
                    <label>Angle</label>
                    <div className={styles.fieldValuePreview}>
                        {labelAngle}&deg;
                    </div>
                    <input
                        type="range"
                        value={labelAngle}
                        min={60}
                        max={120}
                        step={1}
                        onChange={(e) => setLabelAngle(parseInt(e.target.value, 10))}
                    />
                </div>
                <div className={styles.field}>
                    <label>Distance from center</label>
                    <div className={styles.fieldValuePreview}>
                        {labelDistance}
                    </div>
                    <input
                        type="range"
                        value={labelDistance}
                        min={0}
                        max={R}
                        step={1}
                        onChange={(e) => setLabelDistance(parseInt(e.target.value, 10))}
                    />
                </div>
            </div>
            <div className={styles.downloads}>
                <button onClick={handleDownloadAsSVG}>
                    SVG Download
                </button>
                <button onClick={handleDownloadAsPNG}>
                    PNG Download
                </button>
            </div>
            {userAvatarUrl && (
                <Avatar
                    url={userAvatarUrl}
                    text={text}
                    fontSize={fontSize}
                    labelDistance={labelDistance}
                    labelAngle={labelAngle}
                    borderColor={borderColor}
                    borderWidth={borderWidth}
                    textColor={textColor}
                />
            )}
        </div>
    );
};
