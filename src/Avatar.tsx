import styles from './Avatar.module.css';

export const SIZE = 320;
export const R = SIZE / 2;

type AvatarProps = {
    url: string;
    text: string;
    fontSize: number;
    // label distance from center in pixels
    labelDistance: number;
    labelAngle: number;
    borderColor: string;
    borderWidth: number;
    textColor: string;
};
export const Avatar = (props: AvatarProps) => {
    const { url, text, fontSize, labelDistance, labelAngle, borderColor, borderWidth, textColor } = props;
    const labelAngleRad = labelAngle / 180 * Math.PI;
    const deltaAngle = Math.acos(labelDistance / R);
    const startAngle = labelAngleRad - deltaAngle;
    const endAngle = labelAngleRad + deltaAngle;
    const sx = R + (R * Math.cos(startAngle));
    const sy = R + (R * Math.sin(startAngle));
    const ex = R + (R * Math.cos(endAngle));
    const ey = R + (R * Math.sin(endAngle));
    const labelArcParams = [ 'M', sx, sy, 'A', R, R, 0, 0, 1, ex, ey, 'L', sx, sy, 'Z', ].join(' ');
    const fontShiftCoeff = 1;
    const textOffsetX = fontSize * fontShiftCoeff * Math.cos(labelAngleRad);
    const textOffsetY = fontSize * fontShiftCoeff * Math.sin(labelAngleRad);

    return (
        <svg width={`${SIZE}px`} height={`${SIZE}px`} viewBox={`0 0 ${SIZE} ${SIZE}`} xmlns="http://www.w3.org/2000/svg" className={styles.avatarPreview}>
            <defs>
                <mask id="combinedMask">
                    {borderWidth > 0 && (
                        <>
                            <circle cx={R} cy={R} r={R} fill="white"/>
                            <circle cx={R} cy={R} r={R - borderWidth} fill="black"/>
                        </>
                    )}

                    <path
                        d={labelArcParams}
                        fill="white"
                    />
                </mask>
                <mask id="avatarMask">
                    <circle cx={R} cy={R} r={R} fill="white"/>
                </mask>

                <path id="textPath" d={`M ${ex} ${ey} L ${sx} ${sy}`} fill="none"/>
            </defs>


            <image
                href={url}
                x={0}
                y={0}
                width={SIZE}
                height={SIZE}
                mask="url(#avatarMask)"
            />

            <circle
                cx={R}
                cy={R}
                r={R}
                fill={borderColor}
                mask="url(#combinedMask)"
            />

            <circle
                cx={R}
                cy={R}
                r={R}
                fill="none"
                stroke={borderColor}
                strokeWidth="1"
                mask="url(#combinedMask)"
            />

            <g mask="url(#combinedMask)">
                <text
                    fill={textColor}
                    fontSize={`${fontSize}px`}
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                    transform={`translate(${textOffsetX} ${textOffsetY})`}
                >
                    <textPath href="#textPath" startOffset="50%" textAnchor="middle">
                        {text}
                    </textPath>
                </text>
            </g>
            {/*<path id="debugLine" d={`M ${sx} ${sy} L ${ex} ${ey}`} stroke="blue" strokeWidth="2"/>*/}
        </svg>

    );
}
