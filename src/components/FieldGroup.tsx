import { type PropsWithChildren } from 'react';

import styles from './FieldGroup.module.css';

type Props = PropsWithChildren & {
    label: string;
}
export const FieldGroup = ({ label, children }: Props) => (
    <div className={styles.fieldGroup}>
        <label>{label}</label>
        {children}
    </div>
);
