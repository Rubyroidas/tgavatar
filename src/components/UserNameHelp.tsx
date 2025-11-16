import { Button } from './Button';
import styles from './UserNameHelp.module.css';

export const UserNameHelp = () => (
    <>
        <Button className={styles.usernameHelpButton} popoverTarget="usernameHelp">❔</Button>
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
    </>
);
