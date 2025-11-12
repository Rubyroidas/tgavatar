import { type PropsWithChildren } from 'react';

import styles from './FieldValuePreview.module.css';

export const FieldValuePreview = ({ children }: PropsWithChildren) => (
    <div className={styles.fieldValuePreview}>
        {children}
    </div>
);
