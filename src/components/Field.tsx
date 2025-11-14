import { type PropsWithChildren, type ReactElement } from 'react';

import styles from './Field.module.css';

type Props = PropsWithChildren & {
    label: string | ReactElement;
}
export const Field = ({ label, children }: Props) => (
    <div className={styles.field}>
        <label className={styles.label}>{label}</label>
        {children}
    </div>
);
