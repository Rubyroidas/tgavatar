import { type PropsWithChildren, type ReactElement } from 'react';

import styles from './Field.module.css';

type Props = PropsWithChildren & {
    icon?: ReactElement;
    label: string;
}
export const Field = ({ icon, label, children }: Props) => (
    <div className={styles.field}>
        <label className={styles.label}>
            {icon} {label}
        </label>
        {children}
    </div>
);
