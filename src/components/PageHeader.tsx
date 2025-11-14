import { type PropsWithChildren } from 'react';

import styles from './PageHeader.module.css';

export const PageHeader = ({ children }: PropsWithChildren) => (
    <div className={styles.header}>
        {children}
    </div>
);
