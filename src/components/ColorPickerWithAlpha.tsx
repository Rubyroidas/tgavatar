import { type ComponentProps, useRef } from 'react';

import styles from './ColorPickerWithAlpha.module.css';
import { colorWithAlphaToRGBA } from '../utils/colorWithAlphaToRGBA';

export type ColorWithAlpha = {
    color: string; // #RRGGBB
    opacity: number; // 0 .. 100

}
type Props = Omit<ComponentProps<'input'>, 'type' | 'onChange'> & ColorWithAlpha & {
    onChange: (colorWithAlpha: ColorWithAlpha) => void;
};
export const ColorPickerWithAlpha = ({ onChange, color, opacity, ...rest }: Props) => {
    const colorInputRef = useRef<HTMLInputElement>(null);
    const handlePreviewClick = () => {
        colorInputRef.current?.click();
    };

    return (
        <div className={styles.container}>
            <div
                className={styles.colorPreviewWrapper}
                onClick={handlePreviewClick}
            >
                <div
                    className={styles.colorPreview}
                    style={{
                        backgroundColor: colorWithAlphaToRGBA({color, opacity}),
                    }}
                />
            </div>
            <input
                {...rest}
                ref={colorInputRef}
                className={styles.colorInput}
                type="color"
                value={color}
                onChange={e => onChange({ color: e.target.value, opacity })}
            />
            <input
                type="range"
                className={styles.opacityInput}
                value={opacity}
                min={0}
                max={100}
                onChange={e => onChange({ color, opacity: parseInt(e.target.value) })}
            />
        </div>
    );
}
