import type { ColorWithAlpha } from './components/ColorPickerWithAlpha';
import { colorWithAlphaToRGBA } from './utils/colorWithAlphaToRGBA';

import styles from './Avatar.module.css';

export const SIZE = 320;
export const R = SIZE / 2;

type AvatarProps = {
    url: string;
    text: string;
    textOffsetY: number;
    fontSize: number;
    textColor: ColorWithAlpha;
    flipTextX: boolean;
    flipTextY: boolean;
    // label distance from center in pixels
    labelColor: ColorWithAlpha;
    labelDistance: number;
    labelAngle: number;
    borderColor: ColorWithAlpha;
    borderWidth: number;
};
export const Avatar = (props: AvatarProps) => {
    const {
        url,
        text,
        textOffsetY: userTextOffsetY,
        fontSize,
        labelColor,
        labelDistance,
        labelAngle,
        borderColor,
        borderWidth,
        textColor,
        flipTextX,
        flipTextY,
    } = props;
    const labelAngleRad = labelAngle / 180 * Math.PI;
    const deltaAngle = Math.acos(labelDistance / R);
    const startAngle = labelAngleRad - deltaAngle;
    const endAngle = labelAngleRad + deltaAngle;
    const sx = R + ((R - borderWidth) * Math.cos(startAngle));
    const sy = R + ((R - borderWidth) * Math.sin(startAngle));
    const ex = R + ((R - borderWidth) * Math.cos(endAngle));
    const ey = R + ((R - borderWidth) * Math.sin(endAngle));
    const labelArcParams = [ 'M', sx, sy, 'A', (R - borderWidth), (R - borderWidth), 0, 0, 1, ex, ey, 'L', sx, sy, 'Z', ].join(' ');
    const textOffsetX = userTextOffsetY * Math.cos(labelAngleRad);
    const textOffsetY = userTextOffsetY * Math.sin(labelAngleRad);

    return (
        <svg width={`${SIZE}px`} height={`${SIZE}px`} viewBox={`0 0 ${SIZE} ${SIZE}`} xmlns="http://www.w3.org/2000/svg" className={styles.avatarPreview}>
            <defs>
                <mask id="borderMask">
                    <circle
                        cx={R}
                        cy={R}
                        r={R}
                        fill="white"
                    />
                    <circle
                        cx={R}
                        cy={R}
                        r={R - borderWidth}
                        fill="black"
                    />
                </mask>
                <mask id="labelMask">
                    <path
                        d={labelArcParams}
                        fill="white"
                    />
                </mask>
                <mask id="avatarMask">
                    <circle cx={R} cy={R} r={R} fill="white"/>
                </mask>

                <path
                    id="textPath"
                    d={`M ${ex} ${ey} L ${sx} ${sy}`}
                    fill="none"
                />
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
                fill={colorWithAlphaToRGBA(borderColor)}
                mask="url(#borderMask)"
            />

            <circle
                cx={R}
                cy={R}
                r={R}
                fill={colorWithAlphaToRGBA(labelColor)}
                mask="url(#labelMask)"
            />

            {borderWidth > 0 && (
                <circle
                    cx={R}
                    cy={R}
                    r={R}
                    fill="none"
                    stroke={colorWithAlphaToRGBA(borderColor)}
                    strokeWidth="1"
                />
            )}

            <g mask="url(#labelMask)">
                <text
                    fill={colorWithAlphaToRGBA(textColor)}
                    fontSize={`${fontSize}px`}
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                    transform={`translate(${textOffsetX} ${textOffsetY})`}
                >
                    <textPath href="#textPath" startOffset="50%" alignmentBaseline="central" textAnchor="middle">
                        {text}
                    </textPath>
                </text>
            </g>
            {/*<path id="debugLine" d={`M ${sx} ${sy} L ${ex} ${ey}`} stroke="blue" strokeWidth="2"/>*/}
        </svg>

    );
}
